'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    division: 'Intelligence',
    location: '',
    bio: '',
    specialties: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hasQuickSignupData, setHasQuickSignupData] = useState(false);

  // Check for quick signup data on component mount
  useEffect(() => {
    const quickSignupData = localStorage.getItem('quickSignupData');
    if (quickSignupData) {
      const parsedData = JSON.parse(quickSignupData);
      setFormData(prev => ({
        ...prev,
        username: parsedData.username || '',
        email: parsedData.email || '',
        password: parsedData.password || '',
        confirmPassword: parsedData.password || '', // Auto-fill confirm password
        firstName: parsedData.firstName || '',
        lastName: parsedData.lastName || '',
        division: parsedData.division || 'Intelligence'
      }));
      setHasQuickSignupData(true);
      // Clear the localStorage data after using it
      localStorage.removeItem('quickSignupData');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSpecialty = () => {
    if (specialty.trim() && !formData.specialties.includes(specialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialty.trim()]
      });
      setSpecialty('');
    }
  };

  const removeSpecialty = (index) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profileData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            division: formData.division,
            location: formData.location,
            bio: formData.bio,
            specialties: formData.specialties
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and redirect
        localStorage.setItem('token', data.token);
        router.push('/profile');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 spy-text mb-2">
            JOIN GOLDENEYE
          </h1>
          <p className="text-sm sm:text-base text-gray-300">{hasQuickSignupData ? 'Complete your agent profile' : 'Create your agent profile'}</p>
          {hasQuickSignupData && (
            <div className="text-center mt-2">
              <p className="text-green-400 text-sm">
                ✓ Basic information saved - Add additional details below
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg border border-yellow-400">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Division */}
          <div>
            <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Division</label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
            >
              <option value="Intelligence">Intelligence</option>
              <option value="Operations">Operations</option>
              <option value="Analysis">Analysis</option>
              <option value="Tech Support">Tech Support</option>
              <option value="Field Agent">Field Agent</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., London, MI6 Headquarters"
              className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief description of your background..."
              rows="3"
              className="w-full bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Specialties</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Add a specialty..."
                className="flex-1 bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 text-sm sm:text-base font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((spec, index) => (
                <span
                  key={index}
                  className="bg-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 sm:py-4 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 spy-text text-sm sm:text-base"
          >
            {loading ? 'CREATING AGENT PROFILE...' : 'JOIN GOLDENEYE'}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-yellow-400 hover:text-yellow-300"
              >
                Sign In
              </button>
            </p>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-gray-600">
            <p className="text-gray-400 mb-2 text-sm sm:text-base">Just want to explore?</p>
            <button
              type="button"
              onClick={() => router.push('/profile-test')}
              className="text-yellow-400 hover:text-yellow-300 spy-text font-bold text-sm sm:text-base"
            >
              → VIEW DEMO PROFILE
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
} 