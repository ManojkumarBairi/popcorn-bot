import { ChromaClient } from "chromadb";
const client = new ChromaClient();

const createCollection = async (collectionName: string) => {
    const collection = await client.createCollection({name: collectionName});
    return collection.id;
}