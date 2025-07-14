import mongoose from 'mongoose';

const FaceRecognitionSchema = new mongoose.Schema({
  scanId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  imageData: {
    type: String,
    required: false // Base64 encoded image or URL
  },
  scanType: {
    type: String,
    enum: ['identification', 'verification', 'surveillance', 'access_control'],
    default: 'identification'
  },
  securityLevel: {
    type: String,
    enum: ['public', 'standard', 'restricted', 'classified', 'top_secret'],
    default: 'standard'
  },
  processingTime: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  faceDetected: {
    type: Boolean,
    required: true
  },
  match: {
    name: String,
    agentId: String,
    confidence: Number,
    clearance: String,
    threat: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical']
    },
    lastSeen: Date
  },
  biometricData: {
    eyeDistance: Number,
    noseWidth: Number,
    mouthWidth: Number,
    facialLandmarks: [{
      x: Number,
      y: Number,
      type: String
    }],
    faceVector: [Number] // Facial encoding vector
  },
  securityStatus: {
    type: String,
    enum: ['CLEAR', 'CAUTION', 'ALERT', 'LOCKDOWN'],
    default: 'CLEAR'
  },
  recommendations: [{
    type: String
  }],
  location: {
    camera: String,
    zone: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  alerts: [{
    type: String,
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.models.FaceRecognition || mongoose.model('FaceRecognition', FaceRecognitionSchema); 