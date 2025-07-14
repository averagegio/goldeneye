import mongoose from 'mongoose';

const SurveillanceSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  zone: {
    type: String,
    required: true,
    enum: ['Perimeter', 'Main Facility', 'Restricted Area', 'Communications', 'HQ', 'Field']
  },
  eventType: {
    type: String,
    required: true,
    enum: ['intrusion', 'unauthorized_access', 'equipment_malfunction', 'routine_patrol', 'security_breach', 'maintenance']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'normal', 'medium', 'high', 'critical'],
    default: 'normal'
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['processing', 'investigating', 'resolved', 'escalated', 'dismissed'],
    default: 'processing'
  },
  threatLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'critical'],
    default: 'none'
  },
  assignedAgent: {
    type: String,
    default: 'Field Operative'
  },
  estimatedResponse: {
    type: String,
    default: '15 minutes'
  },
  actions: [{
    type: String
  }],
  cameraData: {
    cameraId: String,
    timestamp: Date,
    imageUrl: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  resolution: {
    resolvedBy: String,
    resolvedAt: Date,
    resolutionNotes: String
  },
  agentNotes: [{
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    agent: String
  }]
}, {
  timestamps: true
});

export default mongoose.models.Surveillance || mongoose.model('Surveillance', SurveillanceSchema); 