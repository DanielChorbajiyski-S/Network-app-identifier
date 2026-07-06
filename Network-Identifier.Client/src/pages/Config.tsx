import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface SignatureRulePayload {
  appName: string;
  criterionType: string;
  value: string;
}

export default function Config() {
  const [appName, setAppName] = useState('');
  const [value, setValue] = useState('');
  
  const criterionType = "DnsKeyword";

  const configMutation = useMutation({
    mutationFn: async (ruleData: SignatureRulePayload) => {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save signature rule');
      }
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    configMutation.mutate({ 
      appName, 
      criterionType, 
      value 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-black text-center text-2xl font-bold mb-6">Create Signature Rule</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">App Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g., Spotify, Discord"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black">Criterion Type</label>
            <input
              type="text"
              value={criterionType}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-500 shadow-sm sm:text-sm p-2 border cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Currently locked to DnsKeyword</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Keyword / Regex Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., spotify\.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={configMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mt-6"
          >
            {configMutation.isPending ? 'Saving Rule...' : 'Save Signature Rule'}
          </button>

          {configMutation.isError && (
            <p className="text-red-500 text-sm mt-2">Error saving rule. Check console for details.</p>
          )}
          {configMutation.isSuccess && (
            <p className="text-green-500 text-sm mt-2">Rule saved successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}