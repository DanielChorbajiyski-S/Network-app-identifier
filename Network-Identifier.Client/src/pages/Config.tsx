import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function Config() {
  const [networkName, setNetworkName] = useState('');
  const [ipRange, setIpRange] = useState('');

  const configMutation = useMutation({
    mutationFn: async (configData: { name: string; range: string }) => {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    configMutation.mutate({ name: networkName, range: ipRange });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Network Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Network Name</label>
            <input
              type="text"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">IP Range</label>
            <input
              type="text"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              placeholder="e.g., 192.168.1.0/24"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              required
            />
          </div>

          <button
            type="submit"
            disabled={configMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {configMutation.isPending ? 'Saving...' : 'Save Configuration'}
          </button>

          {configMutation.isError && (
            <p className="text-red-500 text-sm mt-2">Error saving configuration.</p>
          )}
          {configMutation.isSuccess && (
            <p className="text-green-500 text-sm mt-2">Configuration saved successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}