import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Complaint } from '../models/Complaint.js';
import { EducationResource } from '../models/EducationResource.js';
import { KnowledgeDocument } from '../models/KnowledgeDocument.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { RulebookChunk } from '../models/RulebookChunk.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  analyzeComplaintWithGemini,
  answerHostelQuestionWithGemini,
  categorizeTaskWithGemini,
  createGeminiEmbedding,
  recommendResourcesWithGemini,
  answerChatQuestion
} from '../services/ai/gemini.service.js';

export const aiRouter = Router();

const objectIdSchema = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), 'Invalid MongoDB ObjectId');

const taskCategorizeSchema = z.object({
  taskId: objectIdSchema.optional(),
  title: z.string().min(3).optional(),
  description: z.string().optional().default(''),
  floor: z.coerce.number().optional(),
  roomNumber: z.string().optional(),
  dueAt: z.string().datetime().optional()
});

const complaintAnalyzeSchema = z.object({
  complaintId: objectIdSchema.optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  floor: z.coerce.number().optional(),
  roomNumber: z.string().optional()
});

const recommendationSchema = z.object({
  userId: objectIdSchema.optional(),
  profile: z
    .object({
      branch: z.string().optional(),
      year: z.string().optional(),
      floor: z.coerce.number().optional(),
      roomNumber: z.string().optional(),
      interests: z.array(z.string()).optional()
    })
    .optional(),
  limit: z.coerce.number().int().positive().max(10).default(5)
});

const askSchema = z.object({
  question: z.string().min(4),
  topK: z.coerce.number().int().positive().max(8).default(5)
});

const embeddingSchema = z.object({
  text: z.string().min(1).max(8000)
});

async function getTaskPayload(input) {
  if (!input.taskId) {
    if (!input.title) {
      const error = new Error('title is required when taskId is not provided');
      error.statusCode = 400;
      throw error;
    }

    return input;
  }

  const task = await Task.findById(input.taskId).lean();

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    title: input.title || task.title,
    description: input.description || task.description || '',
    floor: input.floor ?? task.assignedToFloors?.[0],
    roomNumber: input.roomNumber || task.assignedToRooms?.[0],
    dueAt: input.dueAt || task.dueAt?.toISOString()
  };
}

async function getCoLeaderSignals(floor) {
  const query = {
    role: 'co_leader',
    isActive: true
  };

  if (typeof floor === 'number') {
    query.$or = [{ 'leadershipScope.floors': floor }, { floor }];
  }

  const coLeaders = await User.find(query).select('name floor roomNumber branch interests').limit(10).lean();
  const ids = coLeaders.map((user) => user._id);

  const taskCounts = await Task.aggregate([
    {
      $match: {
        $or: [{ suggestedCoLeader: { $in: ids } }, { acceptedByCoLeader: { $in: ids } }]
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$acceptedByCoLeader', '$suggestedCoLeader'] },
        totalTasks: { $sum: 1 },
        openTasks: {
          $sum: {
            $cond: [{ $in: ['$status', ['assigned', 'in_progress', 'overdue']] }, 1, 0]
          }
        },
        verifiedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'verified'] }, 1, 0]
          }
        }
      }
    }
  ]);

  const countsById = new Map(taskCounts.map((item) => [String(item._id), item]));

  return coLeaders.map((user) => {
    const counts = countsById.get(String(user._id));

    return {
      userId: String(user._id),
      name: user.name,
      floor: user.floor,
      roomNumber: user.roomNumber,
      branch: user.branch,
      interests: user.interests || [],
      totalTasks: counts?.totalTasks || 0,
      openTasks: counts?.openTasks || 0,
      verifiedTasks: counts?.verifiedTasks || 0
    };
  });
}

function pickBestCoLeader(coLeaderSignals) {
  return [...coLeaderSignals].sort((a, b) => {
    const aScore = a.verifiedTasks * 2 - a.openTasks + a.totalTasks * 0.25;
    const bScore = b.verifiedTasks * 2 - b.openTasks + b.totalTasks * 0.25;

    return bScore - aScore;
  })[0];
}

async function getComplaintPayload(input) {
  if (!input.complaintId) {
    if (!input.title || !input.description) {
      const error = new Error('title and description are required when complaintId is not provided');
      error.statusCode = 400;
      throw error;
    }

    return input;
  }

  const complaint = await Complaint.findById(input.complaintId).lean();

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    title: input.title || complaint.title,
    description: input.description || complaint.description,
    floor: input.floor ?? complaint.floor,
    roomNumber: input.roomNumber || complaint.roomNumber
  };
}

async function getRecentComplaintSignals(floor) {
  const since = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const query = { createdAt: { $gte: since } };

  if (typeof floor === 'number') {
    query.floor = floor;
  }

  return Complaint.find(query)
    .select('title category floor roomNumber ai.recurringTopicKey ai.sentiment createdAt')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();
}

async function buildRecommendationProfile(input) {
  if (!input.userId) {
    return input.profile || {};
  }

  const user = await User.findById(input.userId)
    .select('branch year floor roomNumber interests')
    .lean();

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    branch: user.branch,
    year: user.year,
    floor: user.floor,
    roomNumber: user.roomNumber,
    interests: user.interests || [],
    ...input.profile
  };
}

async function getCandidateResources(profile, limit) {
  const query = { isPublished: true };
  const or = [];

  if (profile.branch) or.push({ branch: profile.branch });
  if (profile.floor) or.push({ targetFloors: profile.floor });
  if (profile.roomNumber) or.push({ targetRooms: profile.roomNumber });
  if (profile.interests?.length) or.push({ interests: { $in: profile.interests } });
  if (or.length) query.$or = or;

  const resources = await EducationResource.find(query)
    .select('title description resourceType branch subjects interests url')
    .sort({ createdAt: -1 })
    .limit(Math.max(limit * 4, 12))
    .lean();

  return resources.map((resource) => ({
    id: String(resource._id),
    title: resource.title,
    description: resource.description,
    type: resource.resourceType,
    branch: resource.branch,
    subjects: resource.subjects || [],
    interests: resource.interests || [],
    url: resource.url
  }));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getContextChunks(question, topK) {
  const keywords = question
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2)
    .slice(0, 8);

  const regex = keywords.length ? new RegExp(keywords.map(escapeRegex).join('|'), 'i') : /./;
  const documents = await KnowledgeDocument.find({
    status: 'indexed',
    $or: [{ title: regex }, { textPreview: regex }, { 'chunks.text': regex }]
  })
    .select('title chunks')
    .limit(10)
    .lean();

  const chunks = [];

  for (const document of documents) {
    for (const chunk of document.chunks || []) {
      if (regex.test(chunk.text)) {
        chunks.push({
          documentTitle: document.title,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text.slice(0, 1400)
        });
      }
    }
  }

  return chunks.slice(0, topK);
}

aiRouter.post(
  '/tasks/categorize',
  asyncHandler(async (req, res) => {
    const input = taskCategorizeSchema.parse(req.body);
    const taskPayload = await getTaskPayload(input);
    const coLeaderSignals = await getCoLeaderSignals(taskPayload.floor);
    const aiResult = await categorizeTaskWithGemini(taskPayload, coLeaderSignals);
    const bestCoLeader = pickBestCoLeader(coLeaderSignals);

    if (input.taskId) {
      await Task.findByIdAndUpdate(input.taskId, {
        category: aiResult.category,
        priority: aiResult.priority,
        tags: aiResult.tags,
        suggestedCoLeader: bestCoLeader?.userId,
        ai: {
          categorized: true,
          confidence: aiResult.confidence,
          rationale: aiResult.rationale
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...aiResult,
        suggestedCoLeader: bestCoLeader || null,
        updatedTaskId: input.taskId || null
      }
    });
  })
);

aiRouter.post(
  '/complaints/analyze',
  asyncHandler(async (req, res) => {
    const input = complaintAnalyzeSchema.parse(req.body);
    const complaintPayload = await getComplaintPayload(input);
    const recentComplaintSignals = await getRecentComplaintSignals(complaintPayload.floor);
    const aiResult = await analyzeComplaintWithGemini(complaintPayload, recentComplaintSignals);

    if (input.complaintId) {
      await Complaint.findByIdAndUpdate(input.complaintId, {
        category: aiResult.category,
        ai: {
          sentiment: aiResult.sentiment,
          urgencyScore: aiResult.urgencyScore,
          recurringTopicKey: aiResult.recurringTopicKey,
          flagged: aiResult.flagged,
          rationale: aiResult.rationale
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...aiResult,
        updatedComplaintId: input.complaintId || null
      }
    });
  })
);

aiRouter.post(
  '/resources/recommend',
  asyncHandler(async (req, res) => {
    const input = recommendationSchema.parse(req.body);
    const profile = await buildRecommendationProfile(input);
    const resources = await getCandidateResources(profile, input.limit);
    const aiResult = await recommendResourcesWithGemini(profile, resources);
    const recommendedIdSet = new Set(aiResult.recommendedResourceIds);

    res.json({
      success: true,
      data: {
        ...aiResult,
        resources: resources.filter((resource) => recommendedIdSet.has(resource.id)).slice(0, input.limit)
      }
    });
  })
);

aiRouter.post(
  '/ask',
  asyncHandler(async (req, res) => {
    const input = askSchema.parse(req.body);
    const contextChunks = await getContextChunks(input.question, input.topK);

    if (!contextChunks.length) {
      return res.json({
        success: true,
        data: {
          answer: 'The official hostel documents do not contain enough information to answer this yet.',
          confidence: 0,
          citations: []
        }
      });
    }

    const aiResult = await answerHostelQuestionWithGemini(input.question, contextChunks);

    return res.json({
      success: true,
      data: aiResult
    });
  })
);

aiRouter.post(
  '/embeddings',
  asyncHandler(async (req, res) => {
    const input = embeddingSchema.parse(req.body);
    const embedding = await createGeminiEmbedding(input.text);

    res.json({
      success: true,
      data: {
        dimensions: embedding.length,
        embedding
      }
    });
  })
);

const chatSchema = z.object({
  question: z.string().min(1)
});

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

aiRouter.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const input = chatSchema.parse(req.body);
    const queryEmbedding = await createGeminiEmbedding(input.question);
    
    let relevantChunks = [];
    let maxSimilarity = 0;

    // 1. Try Atlas Vector Search
    try {
      const results = await RulebookChunk.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 10,
            limit: 3
          }
        }
      ]);
      if (results && results.length > 0) {
        relevantChunks = results.map(r => ({ text: r.text, pageNumber: r.pageNumber }));
        maxSimilarity = 1.0;
      }
    } catch (err) {
      console.log("Atlas Vector Search index failed or is unconfigured, using in-memory cosine similarity:", err.message);
    }

    // 2. Fallback to in-memory cosine similarity
    if (relevantChunks.length === 0) {
      const allChunks = await RulebookChunk.find().lean();
      if (allChunks.length > 0) {
        const scored = allChunks.map(chunk => ({
          ...chunk,
          score: cosineSimilarity(queryEmbedding, chunk.embedding)
        }));
        scored.sort((a, b) => b.score - a.score);
        
        const top3 = scored.slice(0, 3);
        maxSimilarity = top3.length > 0 ? top3[0].score : 0;
        
        // Accept matches above threshold
        if (maxSimilarity >= 0.65) {
          relevantChunks = top3.map(c => ({ text: c.text, pageNumber: c.pageNumber }));
        }
      }
    }

    // 3. Generate Answer
    const answer = await answerChatQuestion(input.question, relevantChunks);

    res.json({
      success: true,
      data: {
        answer,
        chunksFound: relevantChunks.length,
        maxSimilarityScore: maxSimilarity
      }
    });
  })
);
