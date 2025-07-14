#!/usr/bin/env node

// Setup script for GoldenEye Intelligence Division
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('🔧 Setting up GoldenEye Intelligence Division Database...\n');
  
  // Create .env.local file
  const envContent = `MONGODB_URI=mongodb+srv://cluster0.miyz5qb.mongodb.net/goldeneye?retryWrites=true&w=majority
NODE_ENV=development`;
  
  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Created .env.local file');
  } catch (error) {
    console.log('⚠️  Could not create .env.local file automatically');
    console.log('Please create .env.local manually with the following content:');
    console.log(envContent);
  }
  
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  try {
    await execAsync('npm install mongoose');
    console.log('✅ Mongoose installed successfully');
  } catch (error) {
    console.log('⚠️  Error installing mongoose:', error.message);
  }
  
  // Test database connection
  console.log('\n🔗 Testing database connection...');
  try {
    const { seedDatabase } = await import('./lib/seedData.js');
    const result = await seedDatabase();
    
    if (result) {
      console.log('✅ Database connected and seeded successfully');
    } else {
      console.log('❌ Database seeding failed');
    }
  } catch (error) {
    console.log('⚠️  Database connection error:', error.message);
    console.log('Please ensure your MongoDB Atlas cluster is running');
  }
  
  console.log('\n🎯 Setup complete!');
  console.log('Your GoldenEye Intelligence Division APIs are now connected to MongoDB');
  console.log('\nAvailable endpoints:');
  console.log('• /api/auth - Authentication system');
  console.log('• /api/agents - Agent management');
  console.log('• /api/missions - Mission control');
  console.log('• /api/surveillance - Surveillance network');
  console.log('• /api/eyetracking - Eye tracking system');
  console.log('• /api/facerecognition - Face recognition system');
  console.log('• /api/status - System status');
  console.log('• /api/auth/counter - Activity analytics');
  
  console.log('\n🚀 Run "npm run dev" to start the development server');
}

setupDatabase().catch(console.error); 