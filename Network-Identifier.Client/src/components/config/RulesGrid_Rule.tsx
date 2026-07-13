import { Icon } from '../common/Icon';

interface RulesGrid_RuleProps {
  app: string;
  keywords: string[];
}

export function RulesGrid_Rule({ app, keywords }: RulesGrid_RuleProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all bg-gray-50/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100">
          {Icon(app, "w-6 h-6 text-indigo-600")}
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
  );
}
