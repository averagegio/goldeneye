'use client';
import { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';

export default function Surveillance() {
  const [activeTab, setActiveTab] = useState('live');
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      name: 'Main Entrance',
      status: 'active',
      location: 'Building A - Floor 1',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Server Room',
      status: 'inactive',
      location: 'Basement Level 2',
      lastUpdate: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    {
      id: 3,
      name: 'Parking Garage',
      status: 'active',
      location: 'Building B - Ground',
      lastUpdate: new Date().toISOString()
    }
  ]);

  // Initialize camera access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setHasPermission(false);
      setIsRecording(false);
    }
  };

  // Toggle recording (placeholder - would need backend implementation)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual recording functionality
    console.log(isRecording ? 'Recording stopped' : 'Recording started');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const LiveCameraTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-yellow-400">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400">LIVE CAMERA FEED</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            {!hasPermission ? (
              <button
                onClick={startCamera}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
              >
                START CAMERA
              </button>
            ) : (
              <>
                <button
                  onClick={toggleRecording}
                  className={`px-3 sm:px-4 py-2 rounded font-bold text-sm sm:text-base ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  }`}
                >
                  {isRecording ? '⏹ STOP REC' : '⏺ RECORD'}
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-700 text-sm sm:text-base"
                >
                  STOP CAMERA
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {hasPermission ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ● REC
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                Live Feed - {new Date().toLocaleTimeString()}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 px-4">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">📷</div>
                <p className="text-lg sm:text-xl">Click "START CAMERA" to begin surveillance</p>
                <p className="text-xs sm:text-sm mt-2">Camera access required</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const NetworkFeedsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {feeds.map(feed => (
          <div key={feed.id} className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-yellow-400 text-sm sm:text-base">{feed.name}</h3>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(feed.status)}`}></div>
            </div>
            
            <div className="relative bg-black rounded mb-3" style={{ aspectRatio: '16/9' }}>
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {feed.status === 'active' ? (
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-2">📹</div>
                    <p className="text-xs sm:text-sm">Feed Active</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-2 opacity-50">📹</div>
                    <p className="text-xs sm:text-sm text-red-400">Feed Offline</p>
                  </div>
                )}
              </div>
              {feed.status === 'active' && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              )}
            </div>
            
            <div className="text-xs sm:text-sm space-y-1">
              <p className="text-gray-400">{feed.location}</p>
              <p className="text-gray-500">
                Last update: {new Date(feed.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-yellow-400 text-black py-1 px-2 rounded text-xs sm:text-sm hover:bg-yellow-500">
                VIEW
              </button>
              <button className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-xs sm:text-sm hover:bg-gray-700">
                CONFIG
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add New Feed */}
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">ADD NEW FEED</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Feed Name"
            className="bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
          />
          <input
            type="text"
            placeholder="Stream URL"
            className="bg-black border border-gray-600 p-2 sm:p-3 rounded text-white text-sm sm:text-base"
          />
          <button className="bg-yellow-400 text-black py-2 sm:py-3 px-4 rounded font-bold hover:bg-yellow-500 text-sm sm:text-base">
            ADD FEED
          </button>
        </div>
      </div>
    </div>
  );

  const RecordingsTab = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">RECORDED FOOTAGE</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 p-4 rounded gap-3 sm:gap-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 sm:w-16 h-9 sm:h-12 bg-black rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-2xl">🎬</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base truncate">Recording_{String(i).padStart(3, '0')}.mp4</p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {new Date(Date.now() - i * 1000 * 60 * 60).toLocaleDateString()} • 15:32 duration
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700">
                  PLAY
                </button>
                <button className="bg-yellow-400 text-black px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-500">
                  DOWNLOAD
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700">
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 spy-text mb-2">
            SURVEILLANCE SYSTEM
          </h1>
          <p className="text-sm sm:text-base text-gray-300">Real-time monitoring and recording</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-6 md:mb-8">
          {[
            { id: 'live', label: '📹 LIVE CAMERA', shortLabel: '📹 LIVE' },
            { id: 'network', label: '🌐 NETWORK FEEDS', shortLabel: '🌐 FEEDS' },
            { id: 'recordings', label: '🎬 RECORDINGS', shortLabel: '🎬 REC' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold spy-text text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'live' && <LiveCameraTab />}
        {activeTab === 'network' && <NetworkFeedsTab />}
        {activeTab === 'recordings' && <RecordingsTab />}
      </div>
      </div>
    </div>
  );
} 