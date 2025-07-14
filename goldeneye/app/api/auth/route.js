// Authentication API endpoint for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import Agent from '../../../lib/models/Agent.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';
import { seedDatabase } from '../../../lib/seedData.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Seed database if needed
    const agentCount = await Agent.countDocuments();
    if (agentCount === 0) {
      await seedDatabase();
    }
    
    return Response.json({
      message: "GoldenEye Authentication System Online",
      status: "operational",
      clearanceLevel: "classified",
      timestamp: new Date().toISOString(),
      registeredAgents: await Agent.countDocuments(),
      activeAgents: await Agent.countDocuments({ status: "active" })
    });
  } catch (error) {
    return Response.json({
      message: "Authentication system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { agentId, email, password, operation } = body;

    // Find agent in database
    const agent = await Agent.findOne({ agentId }).select('-__v');
    
    if (agent && agent.status === 'active') {
      // Update last seen timestamp
      agent.lastSeen = new Date();
      await agent.save();
      
      // Update activity counter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await ActivityCounter.findOneAndUpdate(
        { date: today },
        {
          $inc: {
            'counters.totalLogins': 1,
            'todayActivity.newLogins': 1
          }
        },
        { upsert: true }
      );
      
      return Response.json({
        success: true,
        agent: {
          agentId: agent.agentId,
          name: agent.name,
          clearance: agent.clearance,
          status: agent.status,
          location: agent.location,
          specialties: agent.specialties,
          missions: agent.missions,
          lastSeen: agent.lastSeen
        },
        token: `gt_${Date.now()}_${agentId}`,
        message: "Agent authenticated successfully",
        accessGranted: true,
        timestamp: new Date().toISOString()
      });
    } else {
      return Response.json({
        success: false,
        message: agent ? "Agent account inactive" : "Invalid agent credentials",
        accessGranted: false
      }, { status: 401 });
    }
  } catch (error) {
    return Response.json({
      success: false,
      message: "Authentication system error",
      error: error.message
    }, { status: 500 });
  }
}