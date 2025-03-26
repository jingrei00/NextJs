import { MongoClient } from 'mongodb';

// Hardcode the MongoDB URI if it's not provided through environment variables
const uri =
	process.env.MONGODB_URI ||
	'mongodb+srv://memesploit:LZ6LqxuMFutyTkHm@cluster0.kabe7.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

if (!uri) {
	throw new Error('Invalid/Missing MongoDB URI');
}

const options = { appName: 'devrel.template.nextjs' };

let clientPromise: MongoClient;

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by Hot Module Replacement.
	const globalWithMongo = global as typeof globalThis & {
		_mongoClient?: MongoClient;
	};

	if (!globalWithMongo._mongoClient) {
		globalWithMongo._mongoClient = new MongoClient(uri, options);
	}
	clientPromise = globalWithMongo._mongoClient;
} else {
	// In production mode, it's best to not use a global variable.
	clientPromise = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
