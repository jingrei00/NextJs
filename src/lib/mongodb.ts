import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.trim(); // Add .trim()

if (!uri) {
	throw new Error('MONGODB_URI not defined');
}

let clientPromise: MongoClient;

if (process.env.NODE_ENV === 'development') {
	const globalWithMongo = global as typeof globalThis & {
		_mongoClient?: MongoClient;
	};

	if (!globalWithMongo._mongoClient) {
		globalWithMongo._mongoClient = new MongoClient(uri);
	}
	clientPromise = globalWithMongo._mongoClient;
} else {
	// In production mode, it's best to not use a global variable.
	clientPromise = new MongoClient(uri);
}

export default clientPromise;
