import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import toast from 'react-hot-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Home() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Logging in...');

      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: formData.email.trim(),
        password: formData.password
      });

      toast.dismiss();

      if (response.data.success) {
        localStorage.setItem('sentechain_user', JSON.stringify(response.data.user));
        localStorage.setItem('sentechain_token', response.data.token);
        toast.success('Welcome back!');
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Invalid email or password';
      
      // If account doesn't exist, suggest registration
      if (errorMessage.includes('Invalid email') || error.response?.status === 400) {
        toast.error('Account not found. Please create an account first.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Creating your account...');

      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      toast.dismiss();

      if (response.data.success) {
        localStorage.setItem('sentechain_user', JSON.stringify(response.data.user));
        localStorage.setItem('sentechain_token', response.data.token);
        toast.success('Account created successfully!');
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SenteChain - Send Money Instantly on Base</title>
        <meta name="description" content="Send, receive, and save USDT on Base blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">SenteChain</h1>
            <p className="text-white opacity-90">
              Send money instantly with USDT on Base
            </p>
          </div>

          {/* Auth Card */}
          <div className="card">
            {/* Tab Switcher */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mode === 'login'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mode === 'register'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="input-field"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full btn-primary"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="input-field"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+256..."
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.phone || !formData.email || !formData.password}
                  className="w-full btn-primary"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-900 mb-2">
                Why SenteChain?
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ No crypto knowledge needed</li>
                <li>✓ Instant transfers with zero fees</li>
                <li>✓ Save and earn with locked savings</li>
                <li>✓ Built on Base (Coinbase L2)</li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-white">
              <div className="text-2xl mb-1"></div>
              <p className="text-xs opacity-90">Instant</p>
            </div>
            <div className="text-white">
              <div className="text-2xl mb-1"></div>
              <p className="text-xs opacity-90">Secure</p>
            </div>
            <div className="text-white">
              <div className="text-2xl mb-1"></div>
              <p className="text-xs opacity-90">Global</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white text-xs mt-8 opacity-75">
            Powered by Base Sepolia Testnet
          </p>
        </div>
      </div>
    </>
  );
}
