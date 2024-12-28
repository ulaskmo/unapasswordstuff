import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db;
let usersCollection: Collection<any>; // Use `any` for now or your `User` type if strongly typed.

export const connectToDatabase = async () => {
  try {
    const client = new MongoClient(process.env.DB_CONN_STRING || '');
    await client.connect();

    db = client.db(process.env.DB_NAME || '');
    usersCollection = db.collection('passwordstuff'); // Initialize after connection

    console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export { db, usersCollection };
