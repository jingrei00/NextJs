import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
	try {
		const { db } = await connectToDatabase();
		const modules = await db.collection('modules_metadata').find({}).toArray();

		return new Response(JSON.stringify(modules), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error fetching data:', error);
		return new Response('Failed to fetch data', { status: 500 });
	}
}
