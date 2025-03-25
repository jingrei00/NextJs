// src/app/api/importData/route.js
import { connectToDatabase } from '../../lib/mongodb';

export async function POST() {
	try {
		// Fetch the JSON data
		const response = await fetch(
			'https://raw.githubusercontent.com/rapid7/metasploit-framework/refs/heads/master/db/modules_metadata_base.json'
		);

		// Check if the response is successful (status code 200)
		if (!response.ok) {
			return new Response('Failed to fetch data', { status: 500 });
		}

		// Log the raw response for debugging purposes
		const rawResponse = await response.text();
		console.log('Raw Response:', rawResponse); // Log the raw data (before JSON parsing)

		// Parse the JSON
		const data = JSON.parse(rawResponse);
		console.log('Fetched Data:', data); // Log the parsed JSON data

		// The data is an object, so we need to extract all the values (which are objects)
		const moduleArray = Object.values(data); // Convert the object values into an array of module objects
		console.log('Module Array:', moduleArray); // Log the module array

		// If no modules found
		if (!moduleArray || moduleArray.length === 0) {
			console.error('No valid array found for insertion');
			return new Response('No data found to insert', { status: 400 });
		}

		// Connect to MongoDB
		const { db } = await connectToDatabase();

		// Insert the fetched data into MongoDB collection
		const collection = db.collection('modules_metadata');
		await collection.insertMany(moduleArray);

		return new Response('Data successfully imported', { status: 200 });
	} catch (error) {
		console.error('Error importing data:', error);
		return new Response('Failed to import data', { status: 500 });
	}
}
