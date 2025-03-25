import { MongoClient } from '../../lib/mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'yourDatabaseName';

if (!MONGODB_URI) {
	throw new Error('❌ MONGODB_URI is not defined in environment variables.');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}

	const client = new MongoClient(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	await client.connect();
	const db = client.db(MONGODB_DB);

	cachedClient = client;
	cachedDb = db;

	console.log('✅ Connected to MongoDB Atlas');

	return { client, db };
}
