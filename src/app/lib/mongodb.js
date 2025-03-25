// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

// Ensure that this URI is correctly configured in your .env.local file
const client = new MongoClient(process.env.MONGODB_URI);

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}

	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const db = client.db(); // This will use the database specified in the URI
		cachedClient = client;
		cachedDb = db;

		return { client, db };
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw new Error('Failed to connect to MongoDB');
	}
}
