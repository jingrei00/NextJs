// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so the MongoClient is not constantly re-initialized
	if (global._mongoClientPromise) {
		clientPromise = global._mongoClientPromise;
	} else {
		global._mongoClientPromise = client.connect();
		clientPromise = global._mongoClientPromise;
	}
} else {
	// In production mode, it's safe to not use the global variable
	clientPromise = client.connect();
}

export default clientPromise;
