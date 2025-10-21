import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import toast from 'react-hot-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Home() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error('Please enter your email or phone number');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Creating your wallet...');

      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        identifier: identifier.trim(),
      });

      toast.dismiss();

      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem('sentechain_user', JSON.stringify(response.data.user));
        localStorage.setItem('sentechain_token', response.data.token);

        if (response.data.isNewUser) {
          toast.success('Welcome! Your wallet has been created! 🎉');
        } else {
          toast.success('Welcome back! 👋');
        }

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.error || 'Failed to login. Please try again.'
      );
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
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-4xl font-bold text-white mb-2">SenteChain</h1>
            <p className="text-white opacity-90">
              Send money instantly with USDT on Base
            </p>
          </div>

          {/* Login Card */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Get Started
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email or Phone Number</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="your@email.com or +256..."
                  className="input-field"
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll create a secure wallet for you automatically
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !identifier.trim()}
                className="w-full btn-primary"
              >
                {loading ? '⏳ Creating Wallet...' : '🚀 Continue'}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-900 mb-2">
                ✨ Why SenteChain?
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
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs opacity-90">Instant</p>
            </div>
            <div className="text-white">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs opacity-90">Secure</p>
            </div>
            <div className="text-white">
              <div className="text-2xl mb-1">🌍</div>
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
