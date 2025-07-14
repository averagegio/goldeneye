import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  agentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  clearance: {
    type: String,
    required: true,
    enum: ['00', 'tech', 'command', 'standard', 'restricted'],
    default: 'standard'
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'pending', 'compromised', 'missing'],
    default: 'pending'
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  specialties: [{
    type: String,
    enum: ['surveillance', 'intelligence', 'weapons', 'communications', 'tech', 'infiltration', 'combat']
  }],
  missions: {
    type: Number,
    default: 0
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  trainingRequired: [{
    type: String
  }],
  assignedHandler: {
    type: String,
    default: 'M'
  },
  probationPeriod: {
    type: String,
    default: '6 months'
  },
  backgroundCheck: {
    status: {
      type: String,
      enum: ['passed', 'requires_review', 'failed'],
      default: 'requires_review'
    },
    securityClearance: {
      type: String,
      enum: ['approved', 'pending', 'denied'],
      default: 'pending'
    },
    psychProfile: {
      type: String,
      enum: ['suitable', 'requires_evaluation', 'unsuitable'],
      default: 'requires_evaluation'
    }
  }
}, {
  timestamps: true
});

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema); 