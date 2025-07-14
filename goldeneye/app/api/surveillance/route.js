// Surveillance API for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import Surveillance from '../../../lib/models/Surveillance.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get recent surveillance events
    const recentEvents = await Surveillance.find({})
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Calculate stats
    const activeCameras = Math.floor(Math.random() * 50) + 150;
    const alerts = await Surveillance.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      priority: { $in: ['high', 'critical'] }
    });
    
    const locationStats = await Surveillance.aggregate([
      {
        $group: {
          _id: '$zone',
          count: { $sum: 1 },
          status: { $first: 'secure' }
        }
      }
    ]);
    
    const locations = [
      { zone: 'Perimeter', status: 'secure', cameras: 24 },
      { zone: 'Main Facility', status: 'secure', cameras: 18 },
      { zone: 'Restricted Area', status: 'monitored', cameras: 12 },
      { zone: 'Communications', status: 'secure', cameras: 8 },
      { zone: 'HQ', status: 'secure', cameras: 16 }
    ];
    
    return Response.json({
      message: "GoldenEye Surveillance Network",
      status: "monitoring",
      network: {
        activeCameras,
        totalCoverage: "98.7%",
        alerts,
        threatLevel: alerts > 2 ? "elevated" : "normal"
      },
      locations,
      recentEvents: recentEvents.map(event => ({
        eventId: event.eventId,
        zone: event.zone,
        eventType: event.eventType,
        priority: event.priority,
        status: event.status,
        timestamp: event.createdAt,
        description: event.description
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      message: "Surveillance system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { zone, eventType, priority = "normal", description } = body;

    // Generate event ID
    const eventId = `sv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const surveillanceEvent = new Surveillance({
      eventId,
      zone,
      eventType,
      priority,
      description,
      status: "processing",
      assignedAgent: priority === "high" ? "Agent 007" : "Field Operative",
      estimatedResponse: priority === "high" ? "2 minutes" : "15 minutes"
    });

    // Generate response based on event type
    let actions = [];
    let threatLevel = "none";

    switch (eventType) {
      case "intrusion":
        actions = ["Deploy security team", "Lock down sector", "Alert all agents"];
        threatLevel = "high";
        break;
      case "unauthorized_access":
        actions = ["Verify credentials", "Monitor closely", "Send security"];
        threatLevel = "medium";
        break;
      case "equipment_malfunction":
        actions = ["Send technician", "Switch to backup systems"];
        threatLevel = "low";
        break;
      case "routine_patrol":
        actions = ["Continue monitoring", "Log patrol data"];
        threatLevel = "none";
        break;
      default:
        actions = ["Investigate further", "Maintain observation"];
        threatLevel = "unknown";
    }

    surveillanceEvent.actions = actions;
    surveillanceEvent.threatLevel = threatLevel;
    
    const savedEvent = await surveillanceEvent.save();
    
    // Update activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          'counters.surveillanceEvents': 1,
          'todayActivity.surveillanceAlerts': 1
        }
      },
      { upsert: true }
    );

    // Simulate real-time updates
    setTimeout(async () => {
      try {
        await Surveillance.findOneAndUpdate(
          { eventId },
          { 
            status: "resolved",
            'resolution.resolvedBy': "Security Team",
            'resolution.resolvedAt': new Date(),
            'resolution.resolutionNotes': "Event resolved successfully"
          }
        );
        console.log(`Surveillance event ${eventId} status updated to: resolved`);
      } catch (error) {
        console.error('Error updating surveillance event:', error);
      }
    }, 5000);

    return Response.json({
      success: true,
      event: {
        eventId: savedEvent.eventId,
        zone: savedEvent.zone,
        eventType: savedEvent.eventType,
        priority: savedEvent.priority,
        description: savedEvent.description,
        timestamp: savedEvent.createdAt,
        status: savedEvent.status,
        assignedAgent: savedEvent.assignedAgent,
        estimatedResponse: savedEvent.estimatedResponse
      },
      actions,
      threatLevel
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Surveillance system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { eventId, newStatus, agentNotes } = body;

    const surveillanceEvent = await Surveillance.findOne({ eventId });
    if (!surveillanceEvent) {
      return Response.json({
        success: false,
        message: "Surveillance event not found"
      }, { status: 404 });
    }

    // Update event
    surveillanceEvent.status = newStatus;
    
    if (agentNotes) {
      surveillanceEvent.agentNotes.push({
        note: agentNotes,
        timestamp: new Date(),
        agent: "Field Agent"
      });
    }
    
    if (newStatus === 'resolved') {
      surveillanceEvent.resolution = {
        resolvedBy: "Field Agent",
        resolvedAt: new Date(),
        resolutionNotes: agentNotes || "Resolved by field agent"
      };
    }
    
    await surveillanceEvent.save();

    return Response.json({
      success: true,
      message: "Surveillance event updated",
      eventId,
      newStatus,
      agentNotes,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Failed to update surveillance event",
      error: error.message
    }, { status: 500 });
  }
} 