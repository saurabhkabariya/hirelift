import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Test basic database operations
    const stats = {
      collections: {},
      connectionState: mongoose.connection.readyState,
      connectionName: db.databaseName
    };
    
    // Check collections and their document counts
    const collectionNames = ['users', 'referralprofiles', 'referralRequests', 'notifications', 'userStats', 'activities'];
    
    for (const collectionName of collectionNames) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        stats.collections[collectionName] = { count, exists: true };
      } catch (error) {
        stats.collections[collectionName] = { count: 0, exists: false, error: error.message };
      }
    }
    
    // Try to create a test document in referralRequests collection to verify write operations
    const testDoc = {
      _test: true,
      createdAt: new Date(),
      message: 'Database connection test'
    };
    
    try {
      const result = await db.collection('referralRequests').insertOne(testDoc);
      stats.writeTest = { success: true, insertedId: result.insertedId };
      
      // Clean up test document
      await db.collection('referralRequests').deleteOne({ _id: result.insertedId });
      stats.writeTest.cleanedUp = true;
    } catch (writeError) {
      stats.writeTest = { success: false, error: writeError.message };
    }
    
    console.log('Database stats:', stats);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test completed',
      data: stats
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error.message
    }, { status: 500 });
  }
}