'use client';
import Navigation from '../components/Navigation';

export default function ProfileTest() {
  // Mock user data for testing
  const mockUser = {
    username: "agent007",
    email: "james.bond@mi6.gov.uk",
    profile: {
      agentCode: "007-GOLDEN",
      firstName: "James",
      lastName: "Bond",
      division: "Field Agent",
      clearanceLevel: "TOP SECRET",
      location: "London, UK",
      bio: "Licensed to kill. Expert in espionage, combat, and high-tech gadgets.",
      specialties: ["Marksmanship", "Hand-to-hand Combat", "Stealth Operations", "Vehicle Operations"],
      joinDate: "2024-01-15T00:00:00Z"
    },
    subscription: {
      type: "Premium",
      status: "Active"
    },
    createdAt: "2024-01-15T00:00:00Z"
  };

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
      <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 spy-text">AGENT PROFILE TEST</h1>
            <p className="text-sm sm:text-base text-gray-300">Agent Code: {mockUser.profile?.agentCode}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button className="bg-yellow-400 text-black px-4 sm:px-6 py-2 rounded hover:bg-yellow-500 spy-text text-sm sm:text-base">
              EDIT PROFILE
            </button>
            <button className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-red-700 spy-text text-sm sm:text-base">
              LOGOUT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-yellow-400">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-24 sm:w-32 h-24 sm:h-32 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl sm:text-4xl text-yellow-400">🕴️</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {mockUser.profile?.firstName} {mockUser.profile?.lastName}
                </h2>
                <p className="text-sm sm:text-base text-gray-300">@{mockUser.username}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold mt-2 ${getBadgeColor(mockUser.profile?.clearanceLevel)}`}>
                  {mockUser.profile?.clearanceLevel}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Division:</span>
                  <span className="text-yellow-400">{mockUser.profile?.division}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{mockUser.profile?.location}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Join Date:</span>
                  <span className="text-white">
                    {new Date(mockUser.profile?.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Subscription:</span>
                  <span className="text-green-400">{mockUser.subscription?.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Bio Section */}
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">AGENT BIOGRAPHY</h3>
              <p className="text-sm sm:text-base text-gray-300">{mockUser.profile?.bio}</p>
            </div>

            {/* Specialties */}
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">SPECIALTIES</h3>
              <div className="flex flex-wrap gap-2">
                {mockUser.profile?.specialties?.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-400"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Mission Activity */}
            <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">RECENT ACTIVITY</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-white text-sm sm:text-base">Profile created successfully</span>
                  <span className="text-gray-400 ml-auto text-xs sm:text-sm">
                    {new Date(mockUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span className="text-white text-sm sm:text-base">Clearance level upgraded</span>
                  <span className="text-gray-400 ml-auto text-xs sm:text-sm">2 days ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  <span className="text-white text-sm sm:text-base">Mission briefing completed</span>
                  <span className="text-gray-400 ml-auto text-xs sm:text-sm">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
} 