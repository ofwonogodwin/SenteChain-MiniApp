import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { switchToHardhatLocal, switchToBaseSepolia } from '../utils/connectWallet';
import contractsData from '../config/contracts.json';

export default function Settings({ user }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    twoFactor: false,
    darkMode: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('sentechain_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (updatedSettings) => {
    localStorage.setItem('sentechain_settings', JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
    toast.success('Settings saved');
  };

  const handleToggle = (key) => {
    const updatedSettings = {
      ...settings,
      [key]: !settings[key]
    };
    saveSettings(updatedSettings);
  };

  const handleSwitchNetwork = async (network) => {
    try {
      toast.loading(`Switching to ${network}...`);
      if (network === 'hardhat') {
        await switchToHardhatLocal();
      } else {
        await switchToBaseSepolia();
      }
      toast.dismiss();
      toast.success(`Switched to ${network} network`);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to switch network: ' + error.message);
    }
  };

  const handleExportData = () => {
    const data = {
      user,
      contacts: localStorage.getItem('sentechain_contacts'),
      settings: localStorage.getItem('sentechain_settings'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentechain-backup-${Date.now()}.json`;
    a.click();
    toast.success('Data exported successfully');
  };

  const currentNetwork = contractsData?.network === 'localhost' ? 'Hardhat Local' : 'Base Sepolia';

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>

      {/* Account Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Account</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Username</p>
              <p className="text-sm text-gray-500">{user?.username}</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Wallet Address</p>
              <p className="text-sm text-gray-500 truncate">{user?.walletAddress}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(user?.walletAddress);
                toast.success('Address copied');
              }}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Network Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Network</h3>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-medium text-gray-900">Current Network</p>
              <p className="text-sm text-gray-500">{currentNetwork}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSwitchNetwork('hardhat')}
              className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
              disabled={currentNetwork === 'Hardhat Local'}
            >
              Hardhat Local
            </button>
            <button
              onClick={() => handleSwitchNetwork('base-sepolia')}
              className="flex-1 text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
              disabled={currentNetwork === 'Base Sepolia'}
            >
              Base Sepolia
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Preferences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-500">Get notified about transactions</p>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Alerts</p>
              <p className="text-xs text-gray-500">Receive email notifications</p>
            </div>
            <button
              onClick={() => handleToggle('emailAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailAlerts ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg opacity-50">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Coming soon</p>
            </div>
            <button
              disabled
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Data & Privacy</h3>
        <div className="space-y-2">
          <button
            onClick={handleExportData}
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <p className="font-medium text-gray-900">Export Data</p>
            <p className="text-xs text-gray-500">Download your contacts and settings</p>
          </button>
          <button
            onClick={() => {
              if (confirm('This will clear all your local data. Continue?')) {
                localStorage.clear();
                toast.success('Cache cleared');
              }
            }}
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <p className="font-medium text-gray-900">Clear Cache</p>
            <p className="text-xs text-gray-500">Remove all stored data</p>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="pt-6 border-t">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-1">SenteChain MiniApp</p>
          <p className="text-xs">Version 1.0.0</p>
          <p className="text-xs mt-2">Built for EthNile Hackathon 2025</p>
        </div>
      </div>
    </div>
  );
}
