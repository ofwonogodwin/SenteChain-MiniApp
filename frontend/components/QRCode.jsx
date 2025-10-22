import { useState, useRef } from 'react';
import QRCodeLib from 'qrcode';
import toast from 'react-hot-toast';

export default function QRCode({ walletAddress, username }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const url = await QRCodeLib.toDataURL(walletAddress, {
        width: 300,
        margin: 2,
        color: {
          dark: '#8B5CF6', // primary color
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `sentechain-${username}-qr.png`;
    a.click();
    toast.success('QR code downloaded');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Address copied to clipboard');
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `sentechain-${username}-qr.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My SenteChain Wallet',
          text: `Send sUSDT to ${username}`,
          files: [file]
        });
        toast.success('Shared successfully');
      } else {
        toast.error('Sharing not supported on this device');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share');
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-4">QR Code</h2>

      <div className="text-center">
        {/* QR Code Display */}
        <div className="mb-6">
          {!qrCodeUrl ? (
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <div className="w-64 h-64 mx-auto flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-32 h-32 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p className="text-sm">Click below to generate QR code</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 inline-block shadow-md mb-4">
              <img src={qrCodeUrl} alt="Wallet QR Code" className="w-64 h-64 mx-auto" />
            </div>
          )}

          <button
            onClick={generateQRCode}
            disabled={loading}
            className="w-full btn-primary mb-4"
          >
            {loading ? 'Generating...' : qrCodeUrl ? 'Regenerate QR Code' : 'Generate QR Code'}
          </button>
        </div>

        {/* Wallet Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Your Wallet Address</p>
          <p className="text-xs text-gray-600 break-all mb-3">{walletAddress}</p>
          <button
            onClick={copyAddress}
            className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Copy Address
          </button>
        </div>

        {/* Action Buttons */}
        {qrCodeUrl && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadQRCode}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              Download
            </button>
            <button
              onClick={shareQRCode}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Share
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            Share this QR code with others to receive sUSDT payments. Anyone can scan it to get
            your wallet address.
          </p>
        </div>
      </div>
    </div>
  );
}
