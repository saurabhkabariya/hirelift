// Test script to verify PointsRewards API endpoints
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function PointsTestPage() {
  const { token } = useAuth();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint) => {
    if (!token) {
      setResult('Error: No authentication token available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setResult(`${endpoint}:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error testing ${endpoint}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Points API Test</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={() => testAPI('/api/referrals/points')}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4 disabled:opacity-50"
        >
          Test Points Balance
        </button>
        
        <button 
          onClick={() => testAPI('/api/referrals/points/history')}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded mr-4 disabled:opacity-50"
        >
          Test Transaction History
        </button>
        
        <button 
          onClick={() => testAPI('/api/referrals/stats')}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Stats
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">API Response:</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-2">Auth Status:</h3>
        <p className="text-blue-700">
          Token available: {token ? '✅ Yes' : '❌ No'}
        </p>
      </div>
    </div>
  );
}