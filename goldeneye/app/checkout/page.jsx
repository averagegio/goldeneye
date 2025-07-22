'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navigation from '../components/Navigation';
import { createPaymentIntent } from '../../lib/stripe.js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component that uses Stripe Elements
function CheckoutForm({ selectedPlan, customerInfo, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const initializePayment = async () => {
      try {
        const totalAmount = selectedPlan.price + 2.40; // Including tax
        const secret = await createPaymentIntent(totalAmount, selectedPlan.name);
        setClientSecret(secret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        console.error('Payment initialization error:', err);
      }
    };

    initializePayment();
  }, [selectedPlan]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready. Please try again.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            postal_code: customerInfo.zipCode,
            country: customerInfo.country === 'United States' ? 'US' : customerInfo.country
          }
        }
      }
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      setOrderComplete(true);
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-900 p-6 sm:p-8 md:p-12 rounded-lg border border-yellow-400">
              <div className="text-6xl sm:text-8xl mb-6">🎯</div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 spy-text mb-4">
                MISSION ACCEPTED
              </h1>
              <p className="text-sm sm:text-base text-gray-300 mb-6">
                Your premium agent access has been activated successfully.
              </p>
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Order Details</h3>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">{selectedPlan.name}</span>
                  <span className="text-white">${selectedPlan.price}/month</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-yellow-400 text-black px-6 py-3 rounded font-bold hover:bg-yellow-500 spy-text text-sm sm:text-base"
                >
                  ACCESS PROFILE
                </button>
                <button
                  onClick={() => router.push('/surveillance')}
                  className="bg-gray-600 text-white px-6 py-3 rounded font-bold hover:bg-gray-700 spy-text text-sm sm:text-base"
                >
                  START SURVEILLANCE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 spy-text"
        >
          ← BACK TO INFORMATION
        </button>
      </div>

      {/* Payment Information - Now using Stripe Card Element */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">PAYMENT INFORMATION</h3>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Card Details</label>
          <div className="bg-black border border-gray-600 p-3 rounded text-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#8a8a8a',
                    },
                  },
                },
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            🔒 Your payment information is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-yellow-400">
        <button
          type="submit"
          disabled={loading || !stripe || !clientSecret}
          className="w-full bg-yellow-400 text-black py-3 sm:py-4 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 spy-text text-sm sm:text-base"
        >
          {loading ? 'PROCESSING PAYMENT...' : `COMPLETE PURCHASE - $${(selectedPlan.price + 2.40).toFixed(2)}`}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-xs sm:text-sm text-gray-400">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [showPayment, setShowPayment] = useState(false);

  // Mock subscription plan (could come from props or URL params)
  const selectedPlan = {
    name: 'Premium Agent Access',
    price: 29.99,
    features: [
      'Full Surveillance Access',
      'Advanced Camera Controls',
      'Unlimited Recording Storage',
      'Priority Support',
      'Multi-Device Access'
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerInfoSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !customerInfo[field]);
    
    if (missing.length > 0) {
      alert(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }
    
    setShowPayment(true);
  };

  const handleBackToCustomerInfo = () => {
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 spy-text mb-2">
              SECURE CHECKOUT
            </h1>
            <p className="text-sm sm:text-base text-gray-300">
              {showPayment ? 'Complete your payment' : 'Complete your premium agent access purchase'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-yellow-400 sticky top-4">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">ORDER SUMMARY</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold text-white mb-2">{selectedPlan.name}</h4>
                    <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-yellow-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white">${selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Tax:</span>
                      <span className="text-white">$2.40</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold border-t border-gray-600 pt-2 mt-2">
                      <span className="text-yellow-400">Total:</span>
                      <span className="text-yellow-400">${(selectedPlan.price + 2.40).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-400 bg-gray-800 p-3 rounded">
                    <div className="flex items-center mb-2">
                      <span className="text-green-400 mr-2">🔒</span>
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <p>Your payment information is protected with military-grade security.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {!showPayment ? (
                /* Customer Information Form */
                <form onSubmit={handleCustomerInfoSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">PERSONAL INFORMATION</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleChange}
                          className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleChange}
                          className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleChange}
                          className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleChange}
                          className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
                    <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">BILLING ADDRESS</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleChange}
                          className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">City</label>
                          <input
                            type="text"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">State</label>
                          <input
                            type="text"
                            name="state"
                            value={customerInfo.state}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={customerInfo.zipCode}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Country</label>
                          <select
                            name="country"
                            value={customerInfo.country}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                            required
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-yellow-400">
                    <button
                      type="submit"
                      className="w-full bg-yellow-400 text-black py-3 sm:py-4 rounded font-bold hover:bg-yellow-500 spy-text text-sm sm:text-base"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </form>
              ) : (
                /* Stripe Payment Form */
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    selectedPlan={selectedPlan} 
                    customerInfo={customerInfo} 
                    onBack={handleBackToCustomerInfo}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 