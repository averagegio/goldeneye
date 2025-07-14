// Mission Control API for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import Mission from '../../../lib/models/Mission.js';
import Agent from '../../../lib/models/Agent.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    const missions = await Mission.find({})
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      totalMissions: await Mission.countDocuments(),
      activeMissions: await Mission.countDocuments({ status: { $in: ['active', 'planning', 'briefing'] } }),
      completedMissions: await Mission.countDocuments({ status: 'completed' }),
      successRate: "94.7%"
    };

    return Response.json({
      message: "GoldenEye Mission Control",
      status: "operational",
      stats,
      missions: missions.map(mission => ({
        id: mission.missionId,
        codeName: mission.codeName,
        status: mission.status,
        priority: mission.priority,
        assignedAgent: mission.assignedAgent,
        location: mission.location,
        objective: mission.objective,
        progress: mission.progress,
        lastUpdate: mission.lastUpdate || mission.updatedAt
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      message: "Mission control system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { codeName, objective, priority, assignedAgent, location, briefing } = body;

    // Verify agent exists
    const agent = await Agent.findOne({ agentId: assignedAgent });
    if (!agent) {
      return Response.json({
        success: false,
        message: "Assigned agent not found"
      }, { status: 400 });
    }

    // Generate new mission
    const missionId = `op_goldeneye_${Date.now()}`;
    const newMission = new Mission({
      missionId,
      codeName,
      objective,
      priority: priority || "medium",
      assignedAgent,
      location,
      briefing,
      status: "briefing",
      estimatedDuration: priority === "high" ? "3-7 days" : "1-2 weeks",
      requiredClearance: priority === "high" ? "00" : "standard",
      equipment: ["Communication device", "Surveillance kit", "Emergency beacon"],
      contacts: ["Local handler", "Extraction team", "Tech support"],
      riskAssessment: priority === "high" ? "extreme" : "moderate",
      approvalRequired: priority === "high",
      resourcesAvailable: Math.random() > 0.1,
      agentAvailable: agent.status === "active"
    });

    const savedMission = await newMission.save();
    
    // Update activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          'todayActivity.missionUpdates': 1
        }
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: "Mission created successfully",
      mission: {
        id: savedMission.missionId,
        codeName: savedMission.codeName,
        objective: savedMission.objective,
        priority: savedMission.priority,
        assignedAgent: savedMission.assignedAgent,
        location: savedMission.location,
        briefing: savedMission.briefing,
        status: savedMission.status,
        createdAt: savedMission.createdAt,
        createdBy: savedMission.createdBy,
        estimatedDuration: savedMission.estimatedDuration,
        requiredClearance: savedMission.requiredClearance,
        equipment: savedMission.equipment,
        contacts: savedMission.contacts
      },
      validation: {
        riskAssessment: savedMission.riskAssessment,
        approvalRequired: savedMission.approvalRequired,
        resourcesAvailable: savedMission.resourcesAvailable,
        agentAvailable: savedMission.agentAvailable
      },
      nextSteps: savedMission.approvalRequired ? 
        ["Await executive approval", "Prepare detailed briefing", "Coordinate resources"] :
        ["Begin agent briefing", "Deploy equipment", "Initiate operation"],
      estimatedLaunch: savedMission.approvalRequired ? "24-48 hours" : "6-12 hours"
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Mission creation error",
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { missionId, status, progress, agentReport, location } = body;

    const mission = await Mission.findOne({ missionId });
    if (!mission) {
      return Response.json({
        success: false,
        message: "Mission not found"
      }, { status: 404 });
    }

    const previousStatus = mission.status;
    
    // Update mission
    if (status) mission.status = status;
    if (progress !== undefined) mission.progress = progress;
    if (location) mission.location = location;
    if (agentReport) {
      mission.agentReports.push({
        report: agentReport,
        timestamp: new Date(),
        location: location || mission.location
      });
    }
    
    mission.lastUpdate = new Date();
    mission.updatedBy = "Field Agent";
    
    await mission.save();
    
    // Update mission completion counter
    if (status === 'completed' && previousStatus !== 'completed') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await ActivityCounter.findOneAndUpdate(
        { date: today },
        {
          $inc: {
            'counters.missionsCompleted': 1,
            'todayActivity.missionUpdates': 1
          }
        },
        { upsert: true }
      );
    }

    const missionUpdate = {
      missionId,
      previousStatus,
      newStatus: mission.status,
      progress: mission.progress,
      agentReport,
      currentLocation: mission.location,
      updatedAt: mission.lastUpdate,
      updatedBy: mission.updatedBy
    };

    // Generate appropriate responses based on status
    let response = {
      success: true,
      message: "Mission status updated",
      update: missionUpdate,
      instructions: []
    };

    switch (status) {
      case "compromised":
        response.instructions = ["Initiate extraction protocol", "Alert backup team", "Activate emergency contacts"];
        response.priority = "URGENT";
        break;
      case "completed":
        response.instructions = ["Begin debrief", "Submit final report", "Return equipment"];
        response.priority = "standard";
        break;
      case "delayed":
        response.instructions = ["Assess situation", "Request additional resources", "Update timeline"];
        response.priority = "medium";
        break;
      default:
        response.instructions = ["Continue mission", "Maintain contact schedule"];
        response.priority = "standard";
    }

    return Response.json(response);
  } catch (error) {
    return Response.json({
      success: false,
      message: "Failed to update mission status",
      error: error.message
    }, { status: 500 });
  }
} 