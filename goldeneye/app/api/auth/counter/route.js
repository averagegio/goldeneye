// Activity Counter API for GoldenEye Intelligence Division
import dbConnect from '../../../../lib/mongodb.js';
import ActivityCounter from '../../../../lib/models/ActivityCounter.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get today's activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let activityCounter = await ActivityCounter.findOne({ date: today });
    
    // If no counter exists for today, create one with default values
    if (!activityCounter) {
      activityCounter = new ActivityCounter({
        date: today,
        counters: {
          totalLogins: Math.floor(Math.random() * 1000) + 5000,
          eyeTrackingSessions: Math.floor(Math.random() * 500) + 2000,
          faceRecognitionScans: Math.floor(Math.random() * 2000) + 8000,
          surveillanceEvents: Math.floor(Math.random() * 100) + 300,
          agentActivations: Math.floor(Math.random() * 50) + 127,
          missionsCompleted: Math.floor(Math.random() * 20) + 89,
          securityAlerts: Math.floor(Math.random() * 10) + 5
        },
        todayActivity: {
          newLogins: Math.floor(Math.random() * 100) + 50,
          activeEyeTracking: Math.floor(Math.random() * 20) + 15,
          faceMatches: Math.floor(Math.random() * 150) + 200,
          surveillanceAlerts: Math.floor(Math.random() * 5) + 2,
          agentDeployments: Math.floor(Math.random() * 3) + 1,
          missionUpdates: Math.floor(Math.random() * 10) + 8
        }
      });
      
      await activityCounter.save();
    }

    return Response.json({
      message: "GoldenEye Activity Analytics",
      timestamp: new Date().toISOString(),
      totalCounters: activityCounter.counters,
      todayActivity: activityCounter.todayActivity,
      systemEfficiency: activityCounter.systemEfficiency,
      peakActivity: activityCounter.peakActivity,
      lastReset: "Monthly maintenance cycle",
      eventLogs: activityCounter.eventLogs.slice(-10) // Last 10 events
    });
  } catch (error) {
    return Response.json({
      message: "Activity counter system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { event, increment = 1, metadata } = body;

    // Get today's activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let activityCounter = await ActivityCounter.findOne({ date: today });
    
    // Create counter if it doesn't exist
    if (!activityCounter) {
      activityCounter = new ActivityCounter({ date: today });
    }

    // Map event types to counter fields
    const eventMapping = {
      'login': 'totalLogins',
      'eye_tracking': 'eyeTrackingSessions',
      'face_recognition': 'faceRecognitionScans',
      'surveillance': 'surveillanceEvents',
      'agent_activation': 'agentActivations',
      'mission_completed': 'missionsCompleted',
      'security_alert': 'securityAlerts'
    };

    const todayMapping = {
      'login': 'newLogins',
      'eye_tracking': 'activeEyeTracking',
      'face_recognition': 'faceMatches',
      'surveillance': 'surveillanceAlerts',
      'agent_activation': 'agentDeployments',
      'mission_update': 'missionUpdates'
    };

    // Update counters
    const counterField = eventMapping[event];
    const todayField = todayMapping[event];
    
    let previousCount = 0;
    let newCount = 0;
    
    if (counterField) {
      previousCount = activityCounter.counters[counterField] || 0;
      activityCounter.counters[counterField] = previousCount + increment;
      newCount = activityCounter.counters[counterField];
    }
    
    if (todayField) {
      activityCounter.todayActivity[todayField] = 
        (activityCounter.todayActivity[todayField] || 0) + increment;
    }
    
    // Add event log
    activityCounter.eventLogs.push({
      event,
      count: increment,
      timestamp: new Date(),
      metadata
    });
    
    // Keep only last 100 event logs
    if (activityCounter.eventLogs.length > 100) {
      activityCounter.eventLogs = activityCounter.eventLogs.slice(-100);
    }
    
    await activityCounter.save();

    const updateResult = {
      event,
      previousCount,
      newCount,
      increment,
      metadata,
      timestamp: new Date().toISOString(),
      acknowledged: true
    };

    return Response.json({
      success: true,
      message: "Activity counter updated",
      update: updateResult,
      trending: increment > 5 ? "high_activity" : "normal",
      dailyTotal: activityCounter.todayActivity[todayField] || 0
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Counter update error",
      error: error.message
    }, { status: 500 });
  }
}
