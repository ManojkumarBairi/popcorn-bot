"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chromadb_1 = require("chromadb");
const client = new chromadb_1.ChromaClient();
const createCollection = async (collectionName) => {
    const collection = await client.createCollection({ name: collectionName });
    return collection.id;
};
