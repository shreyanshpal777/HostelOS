import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pdf from 'pdf-parse';
import { connectDatabase } from '../config/database.js';
import { createGeminiEmbedding } from '../services/ai/gemini.service.js';
import { RulebookChunk } from '../models/RulebookChunk.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfPath = path.resolve(__dirname, '../../Hostel_embedding-merged.pdf');

async function ingest() {
  try {
    console.log('Connecting to database...');
    await connectDatabase();

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at: ${pdfPath}`);
    }

    console.log(`Reading PDF from ${pdfPath}...`);
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    
    console.log(`Extracted PDF text. Total pages: ${pdfData.numpages}`);
    
    // Split the text into sections/paragraphs
    // Splitting by double newlines or single newlines that look like paragraphs
    const rawParagraphs = pdfData.text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 20); // filter out tiny headers/footers

    console.log(`Found ${rawParagraphs.length} raw paragraphs. Processing and cleaning...`);

    // We can also chunk paragraphs if they are too long, or combine them if they are too short
    const chunks = [];
    let currentChunk = '';
    let pageNum = 1; // pdf-parse doesn't easily give page numbers per chunk in raw text, but we can approximate or defaults to 1

    for (const para of rawParagraphs) {
      // Normalize whitespace
      const cleanPara = para.replace(/\s+/g, ' ');
      
      if ((currentChunk + ' ' + cleanPara).length > 800) {
        if (currentChunk.trim()) {
          chunks.push({ text: currentChunk.trim(), pageNumber: pageNum });
        }
        currentChunk = cleanPara;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n' + cleanPara : cleanPara;
      }
    }
    if (currentChunk.trim()) {
      chunks.push({ text: currentChunk.trim(), pageNumber: pageNum });
    }

    console.log(`Created ${chunks.length} clean chunks for embedding generation.`);

    console.log('Clearing existing rulebook chunks from database...');
    await RulebookChunk.deleteMany({});

    console.log('Generating embeddings and saving to database...');
    let successCount = 0;
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunk.text.slice(0, 40)}...)`);
      
      try {
        const embedding = await createGeminiEmbedding(chunk.text);
        
        const newChunk = new RulebookChunk({
          text: chunk.text,
          embedding,
          pageNumber: chunk.pageNumber,
          chunkIndex: i
        });
        
        await newChunk.save();
        successCount++;
        // Small delay to respect rate limit
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error(`Error processing chunk ${i + 1}:`, err.message);
      }
    }

    console.log(`Ingestion completed! Loaded ${successCount}/${chunks.length} chunks successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
}

ingest();
