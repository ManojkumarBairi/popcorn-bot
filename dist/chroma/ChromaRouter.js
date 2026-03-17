"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromaRouter = void 0;
const chromadb_1 = require("chromadb");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const genai_1 = require("@google/genai");
dotenv_1.default.config(); // Load env vars if using .env
class ChromaRouter {
    router = (0, express_1.Router)();
    chromaClient = new chromadb_1.ChromaClient();
    upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
    genAI = new genai_1.GoogleGenAI({ apiKey: 'AIzaSyAL1TcVpjUZi3dPHFDQ7DTSa-pAcQAwWeU' });
    constructor() {
        this.intializeRouter();
    }
    intializeRouter() {
        this.router.get('/', (req, res) => {
            res.send('success');
        });
        this.router.post(`/createCollection/:collectionName`, async (req, res) => {
            const name = req.params.collectionName;
            const resp = await this.chromaClient.createCollection({
                name: `${name}`
            });
            console.log(resp);
            res.send('success');
        });
        this.router.get(`/collections`, async (req, res) => {
            const resp = await this.chromaClient.listCollections();
            console.log(resp);
            res.send('success');
        });
        this.router.post(`/uploadDoc`, this.upload.single('file'), async (req, res) => {
            try {
                // Check if a file was uploaded
                if (!req.file) {
                    return res.status(400).send('No file uploaded');
                }
                // Read file contents as UTF-8 string (assuming text file)
                const fileContent = req.file.buffer.toString('utf-8');
                const popCorn = await this.chromaClient.getCollection({ name: 'popcorn' });
                const resp = await popCorn.add({
                    ids: [req.file.originalname],
                    documents: [fileContent]
                });
                res.status(200).send('success');
            }
            catch (err) {
                res.status(500).send('error');
            }
        });
        // New /ask endpoint: Use Gemini to answer questions based on ChromaDB retrieval
        this.router.post('/ask', async (req, res) => {
            try {
                const { question } = req.body; // Expect JSON body with "question" field
                if (!question || typeof question !== 'string') {
                    return res.status(400).json({ error: 'Question is required and must be a string' });
                }
                // Step 1: Query ChromaDB for relevant documents
                const collection = await this.chromaClient.getCollection({ name: 'popcorn' });
                const chromaResults = await collection.query({
                    queryTexts: [question],
                    nResults: 5 // Retrieve top 5 similar documents
                });
                // Combine retrieved documents into a single context string
                const docs = chromaResults.documents?.[0]?.join('\n\n') || 'No relevant documents found.';
                if (docs === 'No relevant documents found.') {
                    return res.status(200).json({ answer: 'I couldn\'t find relevant information in the collection.' });
                }
                // Step 2: Use Gemini to generate an answer based on docs and question
                const response = await this.genAI.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: `Based on the following documents, answer the question concisely. If the answer isn't in the documents, say so.\n\nDocuments:\n${docs}\n\nQuestion: ${question}`,
                });
                const answer = response?.text ?? 'Not Found';
                res.status(200).json({ answer });
            }
            catch (err) {
                console.error('Error in /ask endpoint:', err);
                res.status(500).json({ error: 'Failed to process the question' });
            }
        });
    }
}
exports.ChromaRouter = ChromaRouter;
