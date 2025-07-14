// Agent Management API for GoldenEye Intelligence Division
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
    
    const agents = await Agent.find({})
      .select('-__v -backgroundCheck')
      .sort({ lastSeen: -1 });

    return Response.json({
      message: "GoldenEye Agent Management System",
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === "active").length,
      agents: agents.map(agent => ({
        id: agent.agentId,
        name: agent.name,
        status: agent.status,
        clearance: agent.clearance,
        location: agent.location,
        lastSeen: agent.lastSeen,
        missions: agent.missions,
        specialties: agent.specialties
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      message: "Agent management system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, specialties, clearanceLevel, codeName } = body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ agentId: codeName });
    if (existingAgent) {
      return Response.json({
        success: false,
        message: "Agent codename already exists",
        error: "DUPLICATE_AGENT"
      }, { status: 400 });
    }

    // Generate new agent
    const newAgent = new Agent({
      agentId: codeName || `agent_${Date.now()}`,
      name,
      specialties: specialties || ["surveillance", "intelligence"],
      clearance: clearanceLevel || "standard",
      status: "pending",
      trainingRequired: ["weapons", "surveillance", "communications"],
      assignedHandler: "M",
      probationPeriod: "6 months",
      backgroundCheck: {
        status: Math.random() > 0.2 ? "passed" : "requires_review",
        securityClearance: Math.random() > 0.1 ? "approved" : "pending",
        psychProfile: Math.random() > 0.15 ? "suitable" : "requires_evaluation"
      }
    });

    const savedAgent = await newAgent.save();
    
    // Update activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          'counters.agentActivations': 1,
          'todayActivity.agentDeployments': 1
        }
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: "Agent registration initiated",
      agent: {
        id: savedAgent.agentId,
        name: savedAgent.name,
        specialties: savedAgent.specialties,
        clearanceLevel: savedAgent.clearance,
        status: savedAgent.status,
        registeredAt: savedAgent.createdAt,
        trainingRequired: savedAgent.trainingRequired,
        assignedHandler: savedAgent.assignedHandler,
        probationPeriod: savedAgent.probationPeriod
      },
      backgroundCheck: savedAgent.backgroundCheck,
      nextSteps: savedAgent.backgroundCheck.status === "passed" ? 
        ["Begin training", "Issue equipment", "Assign first mission"] :
        ["Complete additional screening", "Submit references", "Schedule interview"],
      estimatedActivation: savedAgent.backgroundCheck.status === "passed" ? "2 weeks" : "4-6 weeks"
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Agent registration error",
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { agentId, status, location, missionUpdate } = body;

    const agent = await Agent.findOne({ agentId });
    if (!agent) {
      return Response.json({
        success: false,
        message: "Agent not found"
      }, { status: 404 });
    }

    const previousStatus = agent.status;
    
    // Update agent
    if (status) agent.status = status;
    if (location) agent.location = location;
    if (missionUpdate) {
      agent.missions += 1;
      agent.lastSeen = new Date();
    }
    
    await agent.save();

    const updateData = {
      agentId,
      previousStatus,
      newStatus: agent.status,
      location: agent.location,
      missionUpdate,
      updatedAt: new Date(),
      updatedBy: "Control"
    };

    return Response.json({
      success: true,
      message: "Agent status updated successfully",
      update: updateData,
      notifications: status === "missing" ? 
        ["Alert sent to all agents", "Search protocols initiated"] :
        status === "compromised" ?
        ["Extraction team deployed", "Cover identities activated"] :
        ["Status logged", "Handler notified"]
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Failed to update agent status",
      error: error.message
    }, { status: 500 });
  }
} 