// Face Recognition API for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import FaceRecognition from '../../../lib/models/FaceRecognition.js';
import Agent from '../../../lib/models/Agent.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get recent face recognition scans
    const activeTargets = await FaceRecognition.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
      faceDetected: true
    });
    
    const todayScans = await FaceRecognition.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    });
    
    return Response.json({
      message: "GoldenEye Face Recognition System",
      status: "scanning",
      algorithm: "Advanced Neural Network",
      accuracy: "99.2%",
      activeTargets,
      todayScans,
      totalScans: await FaceRecognition.countDocuments(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({
      message: "Face recognition system error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { imageData, scanType = "identification", securityLevel = "standard" } = body;

    // Generate scan ID
    const scanId = `fr_${Date.now()}`;
    
    // Simulate face recognition processing
    const processingTime = Math.floor(Math.random() * 3000) + 500; // 500-3500ms
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    const faceDetected = Math.random() > 0.1; // 90% success rate
    
    const faceRecognitionData = new FaceRecognition({
      scanId,
      imageData,
      scanType,
      securityLevel,
      processingTime,
      confidence,
      faceDetected,
      biometricData: {
        eyeDistance: Math.floor(Math.random() * 20) + 60,
        noseWidth: Math.floor(Math.random() * 15) + 25,
        mouthWidth: Math.floor(Math.random() * 20) + 40,
        facialLandmarks: [
          { x: 120, y: 100, type: "left_eye" },
          { x: 180, y: 100, type: "right_eye" },
          { x: 150, y: 130, type: "nose" },
          { x: 150, y: 160, type: "mouth" }
        ],
        faceVector: Array.from({ length: 128 }, () => Math.random())
      }
    });

    if (faceDetected) {
      // Try to match against known agents
      const agents = await Agent.find({ status: 'active' }).limit(10);
      
      // Simulate database match
      const possibleMatches = [
        { name: "Agent 007", agentId: "007", confidence: 95, clearance: "00", threat: "none" },
        { name: "Unknown Subject", agentId: null, confidence: 67, clearance: "none", threat: "medium" },
        { name: "Dr. No", agentId: "villain_001", confidence: 89, clearance: "none", threat: "high" },
        { name: "Civilian", agentId: null, confidence: 78, clearance: "public", threat: "none" }
      ];

      // Add known agents to possible matches
      agents.forEach(agent => {
        if (Math.random() > 0.7) { // 30% chance to match with known agent
          possibleMatches.push({
            name: agent.name,
            agentId: agent.agentId,
            confidence: Math.floor(Math.random() * 20) + 80,
            clearance: agent.clearance,
            threat: "none"
          });
        }
      });

      const match = possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
      
      // Update match data
      faceRecognitionData.match = {
        name: match.name,
        agentId: match.agentId,
        confidence: match.confidence,
        clearance: match.clearance,
        threat: match.threat,
        lastSeen: new Date()
      };
      
      faceRecognitionData.securityStatus = match.threat === "high" ? "ALERT" : 
                                          match.threat === "medium" ? "CAUTION" : "CLEAR";
      
      faceRecognitionData.recommendations = match.threat === "high" ? 
        ["Initiate lockdown", "Alert security"] :
        match.threat === "medium" ? 
        ["Monitor closely", "Verify identity"] :
        ["Access granted", "Continue operation"];
        
      // Add alerts for high-threat matches
      if (match.threat === "high") {
        faceRecognitionData.alerts.push({
          type: "High-threat individual detected",
          severity: "critical",
          timestamp: new Date()
        });
      }
    } else {
      faceRecognitionData.recommendations = ["Improve lighting", "Center subject", "Remove obstructions"];
    }

    const savedData = await faceRecognitionData.save();
    
    // Update activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          'counters.faceRecognitionScans': 1,
          'todayActivity.faceMatches': faceDetected ? 1 : 0
        }
      },
      { upsert: true }
    );

    if (faceDetected) {
      return Response.json({
        success: true,
        recognition: {
          scanId: savedData.scanId,
          processingTime: savedData.processingTime,
          confidence: savedData.confidence,
          faceDetected: savedData.faceDetected,
          timestamp: savedData.createdAt,
          match: savedData.match,
          biometricData: savedData.biometricData,
          securityStatus: savedData.securityStatus,
          recommendations: savedData.recommendations,
          alerts: savedData.alerts
        }
      });
    } else {
      return Response.json({
        success: false,
        recognition: {
          scanId: savedData.scanId,
          processingTime: savedData.processingTime,
          confidence: savedData.confidence,
          faceDetected: savedData.faceDetected,
          timestamp: savedData.createdAt
        },
        message: "No face detected in image",
        recommendations: savedData.recommendations
      });
    }
  } catch (error) {
    return Response.json({
      success: false,
      message: "Face recognition system error",
      error: error.message
    }, { status: 500 });
  }
} 