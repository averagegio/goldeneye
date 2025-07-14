import mongoose from 'mongoose';

const MissionSchema = new mongoose.Schema({
  missionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  codeName: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['briefing', 'planning', 'active', 'completed', 'failed', 'compromised', 'cancelled', 'delayed'],
    default: 'briefing'
  },
  assignedAgent: {
    type: String,
    required: true,
    ref: 'Agent'
  },
  location: {
    type: String,
    required: true
  },
  briefing: {
    type: String,
    required: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  estimatedDuration: {
    type: String,
    default: '1-2 weeks'
  },
  requiredClearance: {
    type: String,
    enum: ['00', 'tech', 'command', 'standard', 'restricted'],
    default: 'standard'
  },
  equipment: [{
    type: String
  }],
  contacts: [{
    type: String
  }],
  riskAssessment: {
    type: String,
    enum: ['low', 'moderate', 'high', 'extreme'],
    default: 'moderate'
  },
  approvalRequired: {
    type: Boolean,
    default: false
  },
  resourcesAvailable: {
    type: Boolean,
    default: true
  },
  agentAvailable: {
    type: Boolean,
    default: true
  },
  agentReports: [{
    report: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: String
  }],
  createdBy: {
    type: String,
    default: 'Control'
  },
  updatedBy: {
    type: String,
    default: 'Control'
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Mission || mongoose.model('Mission', MissionSchema); 