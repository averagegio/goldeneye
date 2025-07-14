import mongoose from 'mongoose';

const EyeTrackingSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'Agent'
  },
  coordinates: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  fixationDuration: {
    type: Number,
    required: true
  },
  gazePattern: {
    type: String,
    enum: ['focused', 'scattered', 'rapid', 'sustained'],
    default: 'focused'
  },
  attentionLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  suspiciousActivity: {
    type: Boolean,
    default: false
  },
  detectedGesture: {
    type: String,
    enum: ['sustained_focus', 'rapid_scanning', 'blink_pattern', 'saccade', 'fixation', null],
    default: null
  },
  recommendations: [{
    type: String
  }],
  calibrationData: {
    accuracy: Number,
    precision: Number,
    calibratedAt: Date
  },
  deviceInfo: {
    camera: String,
    resolution: String,
    frameRate: Number
  },
  environmentalFactors: {
    lighting: String,
    distance: Number,
    angle: Number
  }
}, {
  timestamps: true
});

export default mongoose.models.EyeTracking || mongoose.model('EyeTracking', EyeTrackingSchema); 