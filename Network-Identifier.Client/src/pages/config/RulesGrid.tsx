import { useQuery } from '@tanstack/react-query';
import { getAppIcon } from './iconUtils';

type RulesData = Record<string, string[]>;

const MOCK_RULES: RulesData = {
  "Snapchat": ["sc-cdn", "snapchat"],
  "Instagram": ["cdninstagram", "fbsbx", "fbcdn", "instagram"],
  "Facebook": ["fbsbx", "fbcdn", "facebook"],
  "TikTok": ["ibyteimg.com", "ibytedtos.com", "tiktokv.com", "muscdn", "tiktokcdn"],
  "YouTube": ["googlesyndication", "gstatic", "ytimg", "googlevideo", "youtube"],
  "LinkedIn": ["licdn", "linkedin"],
  "Pinterest": ["pinimg", "pinterest"],
  "Google Maps": ["mobilemaps.googleapis"],
  "X": ["x.com", "twimg", "twitter"],
  "Reddit": ["redditmedia", "redd.it", "reddit"],
};

export default function RulesGrid() {
  const { data: rules, isLoading } = useQuery<RulesData>({
    queryKey: ['signatureRules'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_RULES;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-black text-2xl font-bold mb-6 border-b pb-4">Active Network Rules</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : !rules || Object.keys(rules).length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No active rules found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(rules).map(([app, keywords]) => (
            <div key={app} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all bg-gray-50/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100">
                  {getAppIcon(app, "w-6 h-6 text-indigo-600")}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{app}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}