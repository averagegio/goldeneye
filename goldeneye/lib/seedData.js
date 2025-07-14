import dbConnect from './mongodb.js';
import Agent from './models/Agent.js';
import ActivityCounter from './models/ActivityCounter.js';

const defaultAgents = [
  {
    agentId: "007",
    name: "James Bond",
    clearance: "00",
    status: "active",
    location: "London",
    specialties: ["infiltration", "combat", "surveillance"],
    missions: 127,
    backgroundCheck: {
      status: "passed",
      securityClearance: "approved",
      psychProfile: "suitable"
    }
  },
  {
    agentId: "Q",
    name: "Quartermaster",
    clearance: "tech",
    status: "active",
    location: "Q Branch",
    specialties: ["tech", "weapons", "intelligence"],
    missions: 89,
    backgroundCheck: {
      status: "passed",
      securityClearance: "approved",
      psychProfile: "suitable"
    }
  },
  {
    agentId: "M",
    name: "Control",
    clearance: "command",
    status: "active",
    location: "HQ",
    specialties: ["command", "intelligence", "communications"],
    missions: 234,
    backgroundCheck: {
      status: "passed",
      securityClearance: "approved",
      psychProfile: "suitable"
    }
  },
  {
    agentId: "field_op",
    name: "Field Operative",
    clearance: "standard",
    status: "active",
    location: "Field",
    specialties: ["surveillance", "intelligence"],
    missions: 45,
    backgroundCheck: {
      status: "passed",
      securityClearance: "approved",
      psychProfile: "suitable"
    }
  }
];

export async function seedDatabase() {
  try {
    await dbConnect();

    // Seed agents
    for (const agentData of defaultAgents) {
      await Agent.findOneAndUpdate(
        { agentId: agentData.agentId },
        agentData,
        { upsert: true, new: true }
      );
    }

    // Initialize activity counter for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        date: today,
        counters: {
          totalLogins: 5000,
          eyeTrackingSessions: 2000,
          faceRecognitionScans: 8000,
          surveillanceEvents: 300,
          agentActivations: 127,
          missionsCompleted: 89,
          securityAlerts: 5
        },
        todayActivity: {
          newLogins: 50,
          activeEyeTracking: 15,
          faceMatches: 200,
          surveillanceAlerts: 2,
          agentDeployments: 1,
          missionUpdates: 8
        }
      },
      { upsert: true, new: true }
    );

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

export { defaultAgents }; 