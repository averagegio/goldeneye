// Premium Checkout API endpoint for GoldenEye Intelligence Division
import dbConnect from '../../../lib/mongodb.js';
import Agent from '../../../lib/models/Agent.js';
import ActivityCounter from '../../../lib/models/ActivityCounter.js';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      agentId, 
      name, 
      email, 
      paymentMethod, 
      cardNumber, 
      billingAddress, 
      city, 
      country 
    } = body;

    // Simulate payment processing
    const paymentResult = {
      success: true,
      transactionId: 'TXN-' + Date.now(),
      amount: 7.00,
      currency: 'USD',
      timestamp: new Date().toISOString()
    };

    // Update agent to premium status
    if (agentId) {
      await Agent.findOneAndUpdate(
        { agentId },
        { 
          $set: { 
            premiumStatus: true,
            premiumActivated: new Date(),
            billingInfo: {
              name,
              email,
              paymentMethod,
              billingAddress,
              city,
              country
            }
          }
        },
        { upsert: false }
      );
    }

    // Update activity counter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await ActivityCounter.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          'counters.premiumUpgrades': 1,
          'todayActivity.premiumSignups': 1
        }
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: "Premium subscription activated successfully",
      transactionId: paymentResult.transactionId,
      premiumFeatures: [
        'Advanced eye tracking',
        'Ad-free experience',
        'Premium video controls',
        'Priority support',
        'Custom sensitivity settings',
        'Multi-device sync',
        'Advanced analytics'
      ],
      activationDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({
      success: false,
      message: "Payment processing failed",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agentId');
    
    if (agentId) {
      const agent = await Agent.findOne({ agentId });
      
      return Response.json({
        premiumStatus: agent?.premiumStatus || false,
        premiumActivated: agent?.premiumActivated || null,
        billingInfo: agent?.billingInfo || null
      });
    }
    
    return Response.json({
      message: "Premium subscription status endpoint",
      plans: [
        {
          name: "GoldenEye Premium",
          price: 7.00,
          currency: "USD",
          interval: "monthly",
          features: [
            'Advanced eye tracking',
            'Ad-free experience',
            'Premium video controls',
            'Priority support',
            'Custom sensitivity settings',
            'Multi-device sync',
            'Advanced analytics'
          ]
        }
      ]
    });
  } catch (error) {
    return Response.json({
      message: "Error retrieving premium status",
      error: error.message
    }, { status: 500 });
  }
} 