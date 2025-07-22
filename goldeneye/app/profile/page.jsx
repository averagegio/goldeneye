'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user.profile || {});
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile: formData })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl spy-text">LOADING AGENT PROFILE...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getBadgeColor = (level) => {
    switch (level) {
      case 'CLASSIFIED': return 'bg-red-600';
      case 'TOP SECRET': return 'bg-purple-600';
      case 'SECRET': return 'bg-orange-600';
      case 'CONFIDENTIAL': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 spy-text">AGENT PROFILE</h1>
            <p className="text-gray-300">Agent Code: {user.profile?.agentCode || 'PENDING'}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 spy-text"
            >
              {editing ? 'CANCEL' : 'EDIT PROFILE'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 spy-text"
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-yellow-400">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  {user.profile?.avatar ? (
                    <img src={user.profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-4xl text-yellow-400">👤</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-yellow-400">
                  {user.profile?.firstName} {user.profile?.lastName}
                </h2>
                <p className="text-gray-300">@{user.username}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-2 ${getBadgeColor(user.profile?.clearanceLevel)}`}>
                  {user.profile?.clearanceLevel || 'CONFIDENTIAL'}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Division:</span>
                  <span className="text-yellow-400">{user.profile?.division || 'Intelligence'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{user.profile?.location || 'Classified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Join Date:</span>
                  <span className="text-white">
                    {user.profile?.joinDate ? new Date(user.profile.joinDate).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subscription:</span>
                  <span className="text-green-400">{user.subscription?.type || 'Basic'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">AGENT BIOGRAPHY</h3>
              {editing ? (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-black border border-gray-600 p-3 rounded text-white"
                  rows="4"
                  placeholder="Enter your biography..."
                />
              ) : (
                <p className="text-gray-300">
                  {user.profile?.bio || 'No biography provided.'}
                </p>
              )}
            </div>

            {/* Specialties */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">SPECIALTIES</h3>
              <div className="flex flex-wrap gap-2">
                {user.profile?.specialties?.length > 0 ? (
                  user.profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 px-3 py-1 rounded-full text-sm border border-yellow-400"
                    >
                      {specialty}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">No specialties listed.</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">CONTACT INFORMATION</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-black border border-gray-600 p-2 rounded text-white"
                      placeholder="Enter location..."
                    />
                  ) : (
                    <p className="text-white">{user.profile?.location || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mission Activity (Placeholder for future features) */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">RECENT ACTIVITY</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white">Profile created successfully</span>
                  <span className="text-gray-400 ml-auto text-sm">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded opacity-60">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-400">No recent missions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {editing && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold spy-text shadow-lg"
            >
              SAVE CHANGES
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
} 