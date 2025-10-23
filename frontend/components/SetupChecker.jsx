import { useState, useEffect } from 'react';
import { checkSetup } from '../utils/checkSetup';

export default function SetupChecker() {
    const [setupStatus, setSetupStatus] = useState('checking');
    const [error, setError] = useState(null);

    useEffect(() => {
        checkEnvironment();
    }, []);

    const checkEnvironment = async () => {
        try {
            setSetupStatus('checking');
            const isOk = await checkSetup();
            setSetupStatus(isOk ? 'ready' : 'error');
        } catch (error) {
            setSetupStatus('error');
            setError(error.message);
        }
    };

    if (setupStatus === 'checking') {
        return <div className="text-center p-4">
            <p className="text-gray-600">Checking setup...</p>
        </div>;
    }

    if (setupStatus === 'error') {
        return <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
            <h3 className="text-red-800 font-semibold">Setup Error</h3>
            <p className="text-red-600 text-sm mt-2">{error || 'Please check console for details'}</p>
            <button
                onClick={checkEnvironment}
                className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
                Retry Check
            </button>
        </div>;
    }

    return <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-4">
        <h3 className="text-green-800 font-semibold">✅ Setup Complete</h3>
        <p className="text-green-600 text-sm mt-2">
            Your environment is properly configured
        </p>
    </div>;
}