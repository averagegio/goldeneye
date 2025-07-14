import mongoose from 'mongoose';

const ActivityCounterSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  },
  counters: {
    totalLogins: {
      type: Number,
      default: 0
    },
    eyeTrackingSessions: {
      type: Number,
      default: 0
    },
    faceRecognitionScans: {
      type: Number,
      default: 0
    },
    surveillanceEvents: {
      type: Number,
      default: 0
    },
    agentActivations: {
      type: Number,
      default: 0
    },
    missionsCompleted: {
      type: Number,
      default: 0
    },
    securityAlerts: {
      type: Number,
      default: 0
    }
  },
  todayActivity: {
    newLogins: {
      type: Number,
      default: 0
    },
    activeEyeTracking: {
      type: Number,
      default: 0
    },
    faceMatches: {
      type: Number,
      default: 0
    },
    surveillanceAlerts: {
      type: Number,
      default: 0
    },
    agentDeployments: {
      type: Number,
      default: 0
    },
    missionUpdates: {
      type: Number,
      default: 0
    }
  },
  systemEfficiency: {
    type: String,
    default: '94.7%'
  },
  peakActivity: {
    type: String,
    default: '14:00-16:00 GMT'
  },
  eventLogs: [{
    event: String,
    count: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Create compound index for date queries
ActivityCounterSchema.index({ date: 1 });

export default mongoose.models.ActivityCounter || mongoose.model('ActivityCounter', ActivityCounterSchema); 