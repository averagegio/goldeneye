'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-yellow-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Desktop and Mobile Header */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold text-yellow-400 spy-text hover:text-yellow-300">
            GOLDENEYE
          </Link>

          {/* Desktop Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className="text-white hover:text-yellow-400 transition-colors spy-text"
            >
              HOME
            </Link>
            
            <Link 
              href="/surveillance" 
              className="text-white hover:text-yellow-400 transition-colors spy-text"
            >
              SURVEILLANCE
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-white hover:text-yellow-400 transition-colors spy-text"
                >
                  PROFILE
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors spy-text"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white hover:text-yellow-400 transition-colors spy-text"
                >
                  LOGIN
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors spy-text"
                >
                  JOIN GOLDENEYE
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button - Only visible on Mobile */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-yellow-400 focus:outline-none"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu - Only visible when open */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-yellow-400 pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-white hover:text-yellow-400 transition-colors spy-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
              
              <Link 
                href="/surveillance" 
                className="text-white hover:text-yellow-400 transition-colors spy-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SURVEILLANCE
              </Link>

              {isAuthenticated ? (
                <>
                  <Link 
                    href="/profile" 
                    className="text-white hover:text-yellow-400 transition-colors spy-text"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    PROFILE
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition-colors spy-text text-left"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-white hover:text-yellow-400 transition-colors spy-text"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors spy-text text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    JOIN GOLDENEYE
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 