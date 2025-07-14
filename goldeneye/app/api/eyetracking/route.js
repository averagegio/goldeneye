// Eye Tracking API for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import EyeTracking from '../../../lib/models/EyeTracking.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get recent eye tracking sessions
    const activeSessions = await EyeTracking.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
    });
    
    // Get total data processed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDataCount = await EyeTracking.countDocuments({
      createdAt: { $gte: today }
    });
    
    return Response.json({
      message: "GoldenEye Eye Tracking System",
      status: "calibrated",
      sensors: "active",
      trackingAccuracy: "99.7%",
      activeSessions,
      dataProcessed: `${todayDataCount} samples today`,
      totalSamples: await EyeTracking.countDocuments(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      message: "Eye tracking system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { x, y, fixationDuration, timestamp, userId } = body;

    // Generate session ID if not provided
    const sessionId = `et_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Determine gaze pattern and gesture
    let gazePattern = "focused";
    let detectedGesture = null;
    
    if (fixationDuration > 2000) {
      gazePattern = "sustained";
      detectedGesture = "sustained_focus";
    } else if (fixationDuration < 100) {
      gazePattern = "rapid";
      detectedGesture = "rapid_scanning";
    } else if (fixationDuration < 500) {
      gazePattern = "scattered";
    }

    // Create eye tracking data
    const eyeTrackingData = new EyeTracking({
      sessionId,
      userId: userId || "anonymous",
      coordinates: { x, y },
      fixationDuration,
      gazePattern,
      attentionLevel: Math.floor(Math.random() * 100) + 1,
      suspiciousActivity: Math.random() > 0.9, // 10% chance for demo
      detectedGesture,
      recommendations: detectedGesture === "sustained_focus" ? 
        ["Scroll down", "Click target"] : 
        detectedGesture === "rapid_scanning" ?
        ["Slow down", "Focus attention"] :
        ["Continue normal usage"],
      calibrationData: {
        accuracy: 99.7,
        precision: 98.5,
        calibratedAt: new Date()
      },
      deviceInfo: {
        camera: "HD WebCam",
        resolution: "1920x1080",
        frameRate: 60
      },
      environmentalFactors: {
        lighting: "Good",
        distance: Math.floor(Math.random() * 20) + 50, // 50-70cm
        angle: Math.floor(Math.random() * 30) - 15 // -15 to +15 degrees
      }
    });

    const savedData = await eyeTrackingData.save();
    
    // Update activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          'counters.eyeTrackingSessions': 1,
          'todayActivity.activeEyeTracking': 1
        }
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      trackingData: {
        sessionId: savedData.sessionId,
        coordinates: savedData.coordinates,
        fixationDuration: savedData.fixationDuration,
        timestamp: savedData.createdAt,
        userId: savedData.userId,
        processedAt: savedData.createdAt,
        gazePattern: savedData.gazePattern,
        attentionLevel: savedData.attentionLevel,
        suspiciousActivity: savedData.suspiciousActivity
      },
      detectedGesture: savedData.detectedGesture,
      recommendations: savedData.recommendations,
      securityAlert: savedData.suspiciousActivity,
      calibrationData: savedData.calibrationData,
      environmentalFactors: savedData.environmentalFactors
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Eye tracking system error",
      error: error.message
    }, { status: 500 });
  }
} 