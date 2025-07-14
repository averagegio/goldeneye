// System Status API for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import Agent from '../../../lib/models/Agent.js';
import Mission from '../../../lib/models/Mission.js';
import Surveillance from '../../../lib/models/Surveillance.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';
import EyeTracking from '../../../lib/models/EyeTracking.js';
import FaceRecognition from '../../../lib/models/FaceRecognition.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get current system statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      totalAgents,
      activeAgents,
      onMissionAgents,
      availableAgents,
      activeMissions,
      completedMissionsToday,
      allMissions,
      surveillanceEvents,
      recentSurveillanceAlerts,
      eyeTrackingSessions,
      faceRecognitionScans,
      activityCounter
    ] = await Promise.all([
      Agent.countDocuments(),
      Agent.countDocuments({ status: 'active' }),
      Mission.countDocuments({ status: { $in: ['active', 'planning'] } }),
      Agent.countDocuments({ status: 'active' }),
      Mission.countDocuments({ status: { $in: ['active', 'planning', 'briefing'] } }),
      Mission.countDocuments({ status: 'completed', updatedAt: { $gte: today } }),
      Mission.countDocuments(),
      Surveillance.countDocuments(),
      Surveillance.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        priority: { $in: ['high', 'critical'] }
      }),
      EyeTracking.countDocuments({ createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } }),
      FaceRecognition.countDocuments({ createdAt: { $gte: today } }),
      ActivityCounter.findOne({ date: today })
    ]);

    // Calculate system health
    const systems = {
      authentication: {
        status: "online",
        uptime: "99.8%",
        activeUsers: activeAgents,
        lastIncident: "72 hours ago",
        registeredAgents: totalAgents
      },
      eyeTracking: {
        status: "calibrated", 
        accuracy: "99.7%",
        activeSessions: eyeTrackingSessions,
        dataProcessed: `${eyeTrackingSessions} sessions/hour`
      },
      faceRecognition: {
        status: "scanning",
        algorithm: "Advanced Neural Network v2.1",
        accuracy: "99.2%",
        databaseSize: `${totalAgents} profiles`,
        matchesFound: faceRecognitionScans
      },
      surveillance: {
        status: "monitoring",
        activeCameras: Math.floor(Math.random() * 50) + 150,
        coverage: "98.7%",
        alerts: recentSurveillanceAlerts,
        storage: "87% capacity",
        totalEvents: surveillanceEvents
      },
      agents: {
        status: "operational",
        totalAgents,
        activeAgents,
        onMission: onMissionAgents,
        available: availableAgents
      },
      missions: {
        status: "coordinating",
        activeMissions,
        completedToday: completedMissionsToday,
        successRate: "94.7%",
        averageDuration: "5.2 days",
        totalMissions: allMissions
      }
    };

    // Calculate overall system health
    const onlineSystems = Object.values(systems).filter(s => 
      s.status === "online" || s.status === "operational" || 
      s.status === "calibrated" || s.status === "scanning" || 
      s.status === "monitoring" || s.status === "coordinating"
    ).length;
    
    const totalSystems = Object.keys(systems).length;
    const healthPercentage = Math.round((onlineSystems / totalSystems) * 100);

    // Check for any critical alerts
    const criticalAlerts = [];
    if (recentSurveillanceAlerts > 3) {
      criticalAlerts.push("High surveillance activity detected");
    }
    if (eyeTrackingSessions < 10) {
      criticalAlerts.push("Eye tracking sessions below normal");
    }
    if (activeAgents < (totalAgents * 0.7)) {
      criticalAlerts.push("Low agent availability");
    }
    if (activeMissions > 10) {
      criticalAlerts.push("High mission load detected");
    }

    return Response.json({
      message: "GoldenEye Intelligence Division - System Status",
      timestamp: new Date().toISOString(),
      overallHealth: {
        status: healthPercentage >= 95 ? "excellent" : 
               healthPercentage >= 85 ? "good" : 
               healthPercentage >= 70 ? "fair" : "critical",
        percentage: `${healthPercentage}%`,
        onlineSystems: `${onlineSystems}/${totalSystems}`
      },
      systems,
      criticalAlerts,
      lastSystemCheck: new Date().toISOString(),
      nextScheduledMaintenance: "Sunday 02:00 GMT",
      emergencyProtocols: criticalAlerts.length > 0 ? "standby" : "normal",
      activitySummary: activityCounter ? {
        totalLogins: activityCounter.counters.totalLogins,
        todayActivity: activityCounter.todayActivity,
        systemEfficiency: activityCounter.systemEfficiency
      } : null
    });
  } catch (error) {
    return Response.json({
      message: "System status error",
      error: error.message,
      timestamp: new Date().toISOString(),
      overallHealth: {
        status: "critical",
        percentage: "0%",
        onlineSystems: "0/6"
      }
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { system, action, parameters } = body;

    // Simulate system control actions
    const allowedActions = {
      authentication: ["restart", "lockdown", "reset_tokens"],
      eyeTracking: ["calibrate", "restart", "update_algorithm"],
      faceRecognition: ["update_database", "restart", "adjust_threshold"],
      surveillance: ["enable_zone", "disable_zone", "emergency_lockdown"],
      agents: ["alert_all", "recall_agents", "deploy_team"],
      missions: ["abort_mission", "create_mission", "update_priority"]
    };

    if (!allowedActions[system] || !allowedActions[system].includes(action)) {
      return Response.json({
        success: false,
        message: "Invalid system or action",
        allowedSystems: Object.keys(allowedActions)
      }, { status: 400 });
    }

    // Log system action
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $push: {
          eventLogs: {
            event: `system_${action}`,
            count: 1,
            timestamp: new Date(),
            metadata: { system, action, parameters }
          }
        }
      },
      { upsert: true }
    );

    // Simulate action execution
    const actionResult = {
      system,
      action,
      parameters,
      executedAt: new Date().toISOString(),
      executedBy: "System Administrator",
      result: "success",
      details: `${action} operation completed on ${system} system`
    };

    return Response.json({
      success: true,
      message: "System action executed successfully",
      action: actionResult,
      systemStatus: "updated",
      estimatedEffect: "immediate"
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "System control error",
      error: error.message
    }, { status: 500 });
  }
} 