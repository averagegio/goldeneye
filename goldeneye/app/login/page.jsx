'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and redirect
        localStorage.setItem('token', data.token);
        router.push('/profile');
      } else {
        setError(data.message || 'Login failed');
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
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 spy-text mb-2">
            AGENT ACCESS
          </h1>
          <p className="text-sm sm:text-base text-gray-300">Enter your credentials to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg border border-yellow-400">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Username or Email</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 sm:py-4 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 spy-text text-sm sm:text-base"
          >
            {loading ? 'VERIFYING...' : 'ACCESS GRANTED'}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              New agent?{' '}
              <Link href="/signup" className="text-yellow-400 hover:text-yellow-300">
                Join GoldenEye
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm sm:text-base">
              ← Back to Main Site
            </Link>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
} 