import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { parseGeminiJson } from './json.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const taskCategorySchema = z.object({
  category: z.enum(['maintenance', 'education', 'cleaning', 'mess', 'utility', 'event', 'admin', 'other']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  tags: z.array(z.string()).max(8),
  suggestedRole: z.enum(['leader', 'co_leader', 'admin']),
  rationale: z.string(),
  confidence: z.number().min(0).max(1)
});

const complaintAnalysisSchema = z.object({
  category: z.enum(['water', 'electricity', 'mess', 'maintenance', 'noise', 'cleaning', 'safety', 'other']),
  sentiment: z.enum(['positive', 'neutral', 'negative', 'high_tension']),
  urgencyScore: z.number().min(0).max(1),
  recurringTopicKey: z.string(),
  flagged: z.boolean(),
  rationale: z.string()
});

const resourceRecommendationSchema = z.object({
  industryInsights: z.string(),
  learningPlan: z.array(z.string()).length(3),
  recommendedResourceIds: z.array(z.string()).max(3),
  searchSuggestions: z.array(z.string()).max(5)
});

const hostelAnswerSchema = z.object({
  answer: z.string(),
  confidence: z.number().min(0).max(1),
  citations: z.array(
    z.object({
      documentTitle: z.string(),
      chunkIndex: z.number()
    })
  )
});

function model() {
  return genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2
    }
  });
}

async function generateJson(prompt, schema) {
  const response = await model().generateContent(prompt);
  const rawText = response.response.text();
  const json = parseGeminiJson(rawText);

  return schema.parse(json);
}

export async function categorizeTaskWithGemini(task, coLeaderSignals = []) {
  return generateJson(
    `
You are an AI assistant for a hostel management platform.
Categorize the task and suggest who should handle it.

Return only JSON:
{
  "category": "maintenance|education|cleaning|mess|utility|event|admin|other",
  "priority": "low|normal|high|urgent",
  "tags": ["short_lowercase_tag"],
  "suggestedRole": "leader|co_leader|admin",
  "rationale": "one sentence",
  "confidence": 0.0
}

Task:
Title: ${task.title}
Description: ${task.description || 'None'}
Floor: ${task.floor ?? 'Unknown'}
Room: ${task.roomNumber || 'Unknown'}
Due date: ${task.dueAt || 'Unknown'}

Co-leader history signals:
${JSON.stringify(coLeaderSignals)}
`,
    taskCategorySchema
  );
}

export async function analyzeComplaintWithGemini(complaint, recentComplaintSignals = []) {
  return generateJson(
    `
Analyze this hostel complaint for category, sentiment, urgency, and conflict risk.

Return only JSON:
{
  "category": "water|electricity|mess|maintenance|noise|cleaning|safety|other",
  "sentiment": "positive|neutral|negative|high_tension",
  "urgencyScore": 0.0,
  "recurringTopicKey": "short_lowercase_topic",
  "flagged": true,
  "rationale": "one sentence"
}

Complaint:
Title: ${complaint.title}
Description: ${complaint.description}
Floor: ${complaint.floor ?? 'Unknown'}
Room: ${complaint.roomNumber || 'Unknown'}

Recent related complaint signals:
${JSON.stringify(recentComplaintSignals)}
`,
    complaintAnalysisSchema
  );
}

export async function recommendResourcesWithGemini(profile, resources) {
  const branch = profile.branch || 'Unknown';
  const interests = profile.interests || [];

  return generateJson(
    `You are an expert academic advisor and tech industry mentor. 
A student in the ${branch} branch is interested in: ${interests.join(', ')}.
Based on their profile and the available resources below, generate:
1. Current industry insights (why these interests are relevant today).
2. A structured, 3-step learning plan.
3. The top 3 most relevant resources from the provided list.
Available Resources Database:
${JSON.stringify(resources)}

If the available resources do not perfectly match, suggest general topics they should search for.

Return only JSON conforming strictly to this format:
{
  "industryInsights": "a paragraph detailing current industry insights",
  "learningPlan": [
    "Step 1 details",
    "Step 2 details",
    "Step 3 details"
  ],
  "recommendedResourceIds": ["id1", "id2", "id3"],
  "searchSuggestions": ["suggestion1", "suggestion2"]
}`,
    resourceRecommendationSchema
  );
}

export async function answerHostelQuestionWithGemini(question, contextChunks) {
  return generateJson(
    `
Answer a student question using only the official hostel context below.
If the answer is not in the context, say that the official documents do not contain enough information.

Return only JSON:
{
  "answer": "clear answer",
  "confidence": 0.0,
  "citations": [{"documentTitle": "title", "chunkIndex": 0}]
}

Question:
${question}

Official context chunks:
${JSON.stringify(contextChunks)}
`,
    hostelAnswerSchema
  );
}

export async function createGeminiEmbedding(text) {
  const embeddingModel = genAI.getGenerativeModel({ model: env.GEMINI_EMBEDDING_MODEL });
  const result = await embeddingModel.embedContent(text);

  return result.embedding.values;
}
