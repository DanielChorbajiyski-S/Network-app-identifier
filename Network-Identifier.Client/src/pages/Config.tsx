import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  FaSnapchat, 
  FaInstagram, 
  FaFacebook, 
  FaTiktok, 
  FaYoutube, 
  FaLinkedin, 
  FaPinterest, 
  FaLocationDot, 
  FaXTwitter, 
  FaReddit,
  FaCircleQuestion,
  FaGoogle,
  FaFirefoxBrowser
} from 'react-icons/fa6';
import appIcons from '../data/appIcons.json';

interface SignatureRulePayload {
  appName: string;
  criterionType: string;
  value: string;
}

const iconRegistry: Record<string, React.ElementType> = {
  FaSnapchat,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaPinterest,
  FaLocationDot,
  FaXTwitter,
  FaReddit,
  FaGoogle,
  FaFirefoxBrowser,
  FaCircleQuestion
};

const getAppIcon = (appName: string) => {
  const iconProps = { className: "w-5 h-5 flex-shrink-0 text-gray-700" };
  
  const matchedKey = Object.keys(appIcons).find(
    key => key.toLowerCase() === appName.toLowerCase()
  ) as keyof typeof appIcons | undefined;

  const iconStringName = matchedKey ? appIcons[matchedKey] : undefined;
  
  const IconComponent = iconStringName ? iconRegistry[iconStringName] : FaCircleQuestion;

  return <IconComponent {...iconProps} />;
};

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-black text-center text-2xl font-bold mb-6">Create Signature Rule</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">App Name</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g., Spotify, Discord"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                required
              />
              <div className="p-2.5 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center transition-colors">
                {getAppIcon(appName)}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={configMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mt-6 transition-colors"
          >
            {configMutation.isPending ? 'Saving Rule...' : 'Save Signature Rule'}
          </button>

          {configMutation.isError && (
            <p className="text-red-500 text-sm mt-2 font-medium">Error saving rule. Check console for details.</p>
          )}
          {configMutation.isSuccess && (
            <p className="text-green-600 text-sm mt-2 font-medium">Rule saved successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}