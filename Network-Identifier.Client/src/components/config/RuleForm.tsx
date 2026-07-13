import { useState } from 'react';
import { Icon } from '../common/Icon';
import { useAddSignatureRule } from '../../hooks/useSignatureRules';

export default function RuleForm() {
  const [appName, setAppName] = useState('');
  const [value, setValue] = useState('');
  
  const criterionType = "DnsKeyword";
  const addRuleMutation = useAddSignatureRule();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addRuleMutation.mutate(
      { appName, criterionType, value },
      {
        onSuccess: () => {
          setAppName('');
          setValue('');
        }
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 sticky top-10">
      <h2 className="text-black text-2xl font-bold mb-6 border-b pb-4">Create Rule</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">App Name</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g., Spotify, Discord"
              className="block w-full border rounded-md p-2 border-gray-200 focus: shadow-sm focus:border-indigo-300 focus:ring-indigo-300 hover:border-indigo-300 hover:shadow-md transition-all sm:text-sm text-black"
              required
            />
            <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100">
              {Icon(appName, "w-6 h-6 text-indigo-600")}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black">Criterion Type</label>
          <input
            type="text"
            value={criterionType}
            disabled
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 text-gray-500 shadow-sm sm:text-sm p-2 border cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Currently locked to {criterionType}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Keyword</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., spotify\.com"
            className="mt-1 block w-full border rounded-md p-2 border-gray-200 shadow-sm focus:border-indigo-300 focus:ring-indigo-300 hover:border-indigo-300 hover:shadow-md transition-all sm:text-sm text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={addRuleMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mt-6 transition-colors"
        >
          {addRuleMutation.isPending ? 'Saving...' : 'Save Signature Rule'}
        </button>

          {addRuleMutation.isError && (
            <p className="text-red-500 text-sm mt-2 font-medium">Error saving rule.</p>
          )}
          {addRuleMutation.isSuccess && (
            <p className="text-green-600 text-sm mt-2 font-medium">Rule saved successfully!</p>
          )}
      </form>
    </div>
  );
}