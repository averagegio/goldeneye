'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const TypewriterText = ({ text, speed = 30, delay = 0, isActivated, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isDestructing, setIsDestructing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const paragraphs = Array.isArray(text) ? text : [text];

  useEffect(() => {
    if (!isActivated) {
      setDisplayText('');
      setIsComplete(false);
      setIsDestructing(false);
      setShowWarning(false);
      return;
    }

    let currentText = '';
    let currentParagraphIndex = 0;
    let currentCharIndex = 0;
    let timeoutId;

    const typeNextCharacter = () => {
      if (currentParagraphIndex >= paragraphs.length) {
        setIsComplete(true);
        // Pause for 2 seconds after text completion
        setTimeout(() => {
          setShowWarning(true);
          // Show warning for 1.5 seconds
          setTimeout(() => {
            setIsDestructing(true);
            setShowWarning(false);
            // Call onComplete after the white flash animation
            setTimeout(onComplete, 800);
          }, 1500);
        }, 2000);
        return;
      }

      if (currentCharIndex < paragraphs[currentParagraphIndex].length) {
        currentText += paragraphs[currentParagraphIndex][currentCharIndex];
        setDisplayText(currentText);
        currentCharIndex++;
        timeoutId = setTimeout(typeNextCharacter, speed);
      } else {
        currentText += '\n\n';
        currentParagraphIndex++;
        currentCharIndex = 0;
        timeoutId = setTimeout(typeNextCharacter, speed * 10);
      }
    };

    timeoutId = setTimeout(() => {
      typeNextCharacter();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isActivated, text, speed, delay, onComplete, paragraphs]);

  return (
    <div className={`font-mono min-h-[120px] transition-all duration-800 relative ${
      isDestructing ? 'opacity-0 bg-white' : ''
    }`}>
      {displayText.split('\n\n').map((paragraph, index) => (
        <p key={index} 
           className={`text-[#c5c5c5] text-lg leading-relaxed ${
             index < displayText.split('\n\n').length - 1 ? 'mb-4' : ''
           } p-3 rounded transition-all duration-800 ${
             isDestructing ? 'text-white' : ''
           }`}>
          {paragraph}
          {index < displayText.split('\n\n').length - 1 && <span className="typing-cursor">|</span>}
        </p>
      ))}
      {showWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 font-bold text-xl animate-warning">
          SELF DESTRUCTING MESSAGE
        </div>
      )}
      {isDestructing && (
        <div className="absolute inset-0 bg-white opacity-100 animate-flash"></div>
      )}
    </div>
  );
};

export default function Home() {
  const [activeForm, setActiveForm] = useState(null);
  const [isTypingActivated, setIsTypingActivated] = useState(false);
  const [showLaunchButton, setShowLaunchButton] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [signupInput, setSignupInput] = useState('');
  const [signupInputVisible, setSignupInputVisible] = useState(false);
  
  const trackingFeatures = [
    {
      title: "Advanced Eye Tracking",
      features: [
        "Real-time eye movement detection",
        "Gesture-based video controls",
        "Adaptive interface response",
        "Precision calibration system"
      ]
    },
    {
      title: "Smart Navigation",
      features: [
        "Hands-free scrolling",
        "Gaze-based selection",
        "Dynamic content loading",
        "Customizable sensitivity"
      ]
    },
    {
      title: "Security Features",
      features: [
        "Biometric authentication",
        "Secure gaze patterns",
        "Privacy protection",
        "Multi-factor verification"
      ]
    }
  ];

  const handleSubmit = (e, type) => {
    e.preventDefault();
    console.log(`${type} form submitted`);
    setActiveForm(null);
  };

  const handleLaunch = () => {
    setShowLaunchButton(false);
    setTimeout(() => setIsTypingActivated(true), 300);
  };

  const handleTypingComplete = () => {
    setTimeout(() => setShowDescription(false), 1000);
  };

  const handleLoginClick = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
    setSignupInputVisible(false); // Close signup input if open
  };

  const handleSignupClick = () => {
    setSignupInputVisible(!signupInputVisible);
    setLoginDropdownOpen(false); // Close login dropdown if open
  };

  const loginOptions = [
    'Agent 007',
    'Agent Q',
    'Agent M',
    'Field Operative'
  ];

  const descriptionText = [
    "GoldenEye is a revolutionary new video app that is changing the way we interact with digital content. Instead of traditional scrolling or tapping, GoldenEye uses cutting-edge eye tracking technology to navigate through videos.",
    "Imagine being able to simply look at the screen and have the video automatically play or pause based on your eye movements. Want to skip ahead in a video? Just glance to the right and the app will fast forward to the next scene. Need to adjust the volume? A quick glance up or down and the sound will increase or decrease.",
    "Get ready to experience a whole new way of watching videos with GoldenEye - the app that lets your eyes do the scrolling."
  ];

  const styles = `
    @keyframes flash {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    .animate-flash {
      animation: flash 0.8s ease-out forwards;
    }
    @keyframes warning {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-warning {
      animation: warning 0.5s ease-in-out infinite;
    }
    @keyframes goldenGlow {
      0%, 100% {
        text-shadow: 
          0 0 1px #fff,
          0 0 2px #fff,
          0 0 4px #fff,
          0 0 8px rgba(255, 215, 0, 0.5),
          0 0 16px rgba(255, 215, 0, 0.3),
          0 0 24px rgba(255, 215, 0, 0.2);
      }
      50% {
        text-shadow: 
          0 0 2px #fff,
          0 0 4px #fff,
          0 0 6px #fff,
          0 0 12px rgba(255, 215, 0, 0.6),
          0 0 24px rgba(255, 215, 0, 0.4),
          0 0 32px rgba(255, 215, 0, 0.3);
      }
    }
  `;

  return (
    <div className="min-h-screen relative bg-black">
      <style jsx>{styles}</style>
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-0">
        <Image
          src="./1751500995260-image.gif"
          alt="Background animation"
          fill
          className="min-w-[100%] min-h-[100%] object-cover"
          style={{
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            left: '50%',
            top: '50%'
          }}
          priority
        />
      </div>

      {/* Scrollable Content with Gradient Overlay */}
      <div className="relative min-h-screen z-10">
        {/* Top fade overlay */}
        <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20"></div>

        {/* Content Container */}
        <div className="relative z-30">
          {/* First Section */}
          <section className="min-h-screen flex flex-col items-center pt-20 space-y-8 px-4">
            <div className="text-center">
              <h1 className="text-7xl font-bold text-white tracking-[0.2em] mb-4"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    animation: 'goldenGlow 3s ease-in-out infinite',
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility'
                  }}>
                GOLDENEYE
              </h1>
              
              <p className="text-xl tracking-[0.3em] text-[#8a8a8a] mb-8"
                 style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Intelligence Division
              </p>

              {showLaunchButton && (
                <div className="relative w-full">
                  <button
                    onClick={handleLaunch}
                    className="spy-text py-2 px-6 bg-[#1a1a1a] text-[#8a8a8a] border border-[#333333]
                             hover:bg-[#252525] hover:border-[#444444] hover:text-[#c5c5c5] 
                             transition-all duration-300 tracking-[0.2em] text-base
                             flex items-center gap-3 group rounded absolute left-8"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#333333] group-hover:bg-[#c5c5c5] transition-colors duration-300"></span>
                    INITIALIZE
                    <span className="w-3 h-3 rounded-full bg-[#333333] group-hover:bg-[#c5c5c5] transition-colors duration-300"></span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '#features'}
                    className="spy-text py-2 px-6 bg-[#1a1a1a] text-[#8a8a8a] border border-[#333333]
                             hover:bg-[#252525] hover:border-[#444444] hover:text-[#c5c5c5] 
                             transition-all duration-300 tracking-[0.2em] text-base
                             flex items-center gap-3 group rounded absolute right-8"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#333333] group-hover:bg-[#c5c5c5] transition-colors duration-300"></span>
                    EXPLORE
                    <span className="w-3 h-3 rounded-full bg-[#333333] group-hover:bg-[#c5c5c5] transition-colors duration-300"></span>
                  </button>
                </div>
              )}
            </div>

            {/* Initialize Button and Description */}
            <div className="max-w-3xl mx-auto space-y-4">
              {!showLaunchButton && showDescription && (
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg opacity-0 animate-fade-in">
                  <TypewriterText
                    text={descriptionText}
                    speed={20} 
                    delay={300} 
                    isActivated={isTypingActivated}
                    onComplete={handleTypingComplete} 
                  />
                </div>
              )}
            </div>

            {/* Phone Mockup */}
            <div className="relative w-[180px] h-[370px] bg-[#1a1a1a] rounded-[30px] border-[5px] border-[#333333] mx-auto overflow-hidden shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[75px] h-[16px] bg-[#333333] rounded-b-[14px] flex items-center justify-center">
                {/* Camera */}
                <div className="absolute right-[12px] w-[5px] h-[5px] bg-[#1a1a1a] rounded-full"></div>
                {/* Speaker */}
                <div className="w-[25px] h-[2.5px] bg-[#1a1a1a] rounded-full"></div>
              </div>

              {/* Side Button */}
              <div className="absolute -right-[5px] top-[82px] w-[2px] h-[38px] bg-[#333333] rounded-l"></div>

              {/* Volume Buttons */}
              <div className="absolute -left-[5px] top-[65px] w-[2px] h-[25px] bg-[#333333] rounded-r"></div>
              <div className="absolute -left-[5px] top-[100px] w-[2px] h-[25px] bg-[#333333] rounded-r"></div>

              {/* Screen Content */}
              <div className="h-full flex flex-col items-center justify-center px-3 pt-5 relative">
                {/* Face Recognition GIF */}
                <div className="absolute inset-0 z-0">
                                      <Image
                      src="./eyescan.gif"
                    alt="Face Recognition"
                    fill
                    sizes="180px"
                    className="opacity-80 object-cover"
                    priority
                  />
                </div>

                {/* Overlay Content */}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#333333]/50 animate-pulse"></div>
                  <div className="text-[#8a8a8a] text-[10px] tracking-[0.2em] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded mt-2.5"
                       style={{ fontFamily: 'var(--font-orbitron)' }}>
                    FACE RECOGNITION ACTIVE
                  </div>
                </div>

                {/* Dynamic Interface Elements */}
                <div className="absolute bottom-[50px] left-0 right-0 flex justify-center space-x-1 z-10">
                  <div className="w-1 h-1 rounded-full bg-[#c5c5c5] animate-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-[#333333]"></div>
                  <div className="w-1 h-1 rounded-full bg-[#333333]"></div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-[75px] h-[2.5px] bg-[#8a8a8a] rounded-full z-10"></div>
              </div>
            </div>

            {/* Authentication Section */}
            <div className="flex flex-col items-center gap-4 mb-8 relative">
              <div className="flex justify-center gap-4">
                <div className="relative">
                  <button
                    onClick={handleLoginClick}
                    className="spy-text py-2 px-6 bg-[#1a1a1a] text-[#8a8a8a] border border-[#333333]
                             hover:bg-[#252525] hover:border-[#444444] hover:text-[#c5c5c5]
                             transition-all duration-300 tracking-[0.2em] text-sm rounded"
                    style={{ fontFamily: 'var(--font-spy)' }}
                  >
                    LOGIN
                  </button>
                  {loginDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333333] rounded-md shadow-lg overflow-hidden z-50">
                      {loginOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            console.log(`Selected: ${option}`);
                            setLoginDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[#8a8a8a] hover:bg-[#252525] hover:text-[#c5c5c5] transition-colors duration-300 text-sm tracking-wider"
                          style={{ fontFamily: 'var(--font-spy)' }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={handleSignupClick}
                    className="spy-text py-2 px-6 bg-[#1a1a1a] text-[#8a8a8a] border border-[#333333]
                             hover:bg-[#252525] hover:border-[#444444] hover:text-[#c5c5c5]
                             transition-all duration-300 tracking-[0.2em] text-sm rounded"
                    style={{ fontFamily: 'var(--font-spy)' }}
                  >
                    SIGN UP
                  </button>
                  {signupInputVisible && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-[#333333] rounded-md shadow-lg overflow-hidden p-3 z-50">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={signupInput}
                          onChange={(e) => setSignupInput(e.target.value)}
                          placeholder="Enter codename..."
                          className="flex-1 bg-[#252525] text-[#c5c5c5] border border-[#333333] rounded px-3 py-1.5 
                                   focus:outline-none focus:border-[#444444] text-sm tracking-wider
                                   placeholder-[#8a8a8a]"
                          style={{ fontFamily: 'var(--font-spy)' }}
                        />
                        <button
                          onClick={() => {
                            console.log(`New agent: ${signupInput}`);
                            setSignupInput('');
                            setSignupInputVisible(false);
                          }}
                          className="bg-[#252525] text-[#8a8a8a] px-3 py-1.5 rounded
                                   hover:bg-[#333333] hover:text-[#c5c5c5] transition-colors duration-300
                                   border border-[#333333] text-sm tracking-wider"
                          style={{ fontFamily: 'var(--font-spy)' }}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feature Demo Section */}
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <img 
                    src="./scanning-iris-unlock-smartphone-600x400.jpg" 
                    alt="Eye Tracking Demo"
                    className="rounded-lg shadow-2xl border border-[#333333]"
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="spy-text text-2xl text-[#c5c5c5] tracking-[0.2em] mb-4"
                      style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {trackingFeatures[currentPage].title}
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {trackingFeatures[currentPage].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5c5c5]"></span>
                        <span className="text-[#8a8a8a]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pagination Dots */}
                  <div className="flex justify-center gap-3 mt-8">
                    {trackingFeatures.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentPage === index 
                            ? 'bg-[#c5c5c5] w-4' 
                            : 'bg-[#333333] hover:bg-[#444444]'
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => (prev > 0 ? prev - 1 : trackingFeatures.length - 1))}
                      className="text-[#8a8a8a] hover:text-[#c5c5c5] transition-colors duration-300"
                      aria-label="Previous page"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => (prev < trackingFeatures.length - 1 ? prev + 1 : 0))}
                      className="text-[#8a8a8a] hover:text-[#c5c5c5] transition-colors duration-300"
                      aria-label="Next page"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl text-[#c5c5c5] tracking-[0.2em] mb-8 text-center"
                  style={{ fontFamily: 'var(--font-orbitron)' }}>
                SUBSCRIPTIONS
              </h2>
              
              <div className="flex flex-col md:flex-row gap-8 justify-center px-4">
                {/* Free Plan */}
                <div className="flex-1 max-w-sm bg-[#1a1a1a] border border-[#333333] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                  <div className="p-6">
                    <h3 className="text-xl text-[#c5c5c5] tracking-[0.2em] mb-2"
                        style={{ fontFamily: 'var(--font-orbitron)' }}>
                      FREE
                    </h3>
                    <p className="text-[#8a8a8a] mb-6 tracking-wider">With Ads</p>
                    <div className="text-2xl text-[#c5c5c5] mb-6 tracking-wider">$0</div>
                    <ul className="space-y-3">
                      {[
                        'Basic eye tracking',
                        'Standard video controls',
                        'Limited features',
                        'Ad-supported experience',
                        'Community support'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-[#8a8a8a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#333333]"></span>
                          <span className="tracking-wider text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="mt-8 w-full py-2 px-6 bg-[#252525] text-[#8a8a8a] border border-[#333333]
                               hover:bg-[#333333] hover:text-[#c5c5c5] transition-all duration-300 rounded tracking-wider"
                      style={{ fontFamily: 'var(--font-spy)' }}
                    >
                      GET STARTED
                    </button>
                  </div>
                </div>
                
                {/* Pro Plan */}
                <div className="flex-1 max-w-sm bg-[#1a1a1a] border border-[#333333] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 relative">
                  {/* Pro Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#333333] text-[#c5c5c5] px-3 py-1 rounded-full text-xs tracking-wider"
                          style={{ fontFamily: 'var(--font-spy)' }}>
                      PRO
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-[#c5c5c5] tracking-[0.2em] mb-2"
                        style={{ fontFamily: 'var(--font-orbitron)' }}>
                      PREMIUM
                    </h3>
                    <p className="text-[#8a8a8a] mb-6 tracking-wider">Ad-Free Experience</p>
                    <div className="text-2xl text-[#c5c5c5] mb-6 tracking-wider">
                      $7
                      <span className="text-sm text-[#8a8a8a] ml-1">/month</span>
                    </div>
                    <ul className="space-y-3">
                      {[
                        'Advanced eye tracking',
                        'Premium video controls',
                        'Unlimited features',
                        'Ad-free experience',
                        'Priority support',
                        'Custom sensitivity settings',
                        'Multi-device sync',
                        'Advanced analytics'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-[#8a8a8a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c5c5c5]"></span>
                          <span className="tracking-wider text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="mt-8 w-full py-2 px-6 bg-[#252525] text-[#8a8a8a] border border-[#333333]
                               hover:bg-[#333333] hover:text-[#c5c5c5] transition-all duration-300 rounded tracking-wider
                               relative overflow-hidden group"
                      style={{ fontFamily: 'var(--font-spy)' }}
                    >
                      <span className="relative z-10">UPGRADE NOW</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#333333] to-[#444444] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <footer className="w-full mt-20 border-t border-[#333333] bg-black/40 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Logo Placeholder */}
                  <div className="w-12 h-12 rounded-full border-2 border-[#333333] flex items-center justify-center bg-[#1a1a1a] hover:border-[#c5c5c5] transition-colors duration-300">
                    <Image
                      src="./AI_Generated_Image_2025-07-09_489735641010201.png"
                      alt="GoldenEye Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                      priority
                    />
                  </div>
                  
                  {/* Copyright Text */}
                  <p className="text-[#8a8a8a] text-sm tracking-[0.2em]"
                     style={{ fontFamily: 'var(--font-orbitron)' }}>
                    © 2024 GOLDENEYE INTELLIGENCE
                  </p>
                  
                  {/* Decorative Elements */}
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full bg-[#c5c5c5] animate-pulse"></div>
                    <div className="w-1 h-1 rounded-full bg-[#333333]"></div>
                    <div className="w-1 h-1 rounded-full bg-[#333333]"></div>
                  </div>
                </div>
              </div>
            </footer>
          </section>
        </div>

        {/* Bottom fade overlay */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      </div>
    </div>
  );
} 