import { Loader } from '../common/Loader';
import { useSignatureRules } from '../../hooks/useSignatureRules';
import { RulesGrid_Rule } from './RulesGrid_Rule';

export default function RulesGrid() {
  const { data: rules, isLoading, isError } = useSignatureRules();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-black text-2xl font-bold mb-6 border-b pb-4">Active Network Rules</h2>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-black text-2xl font-bold mb-6 border-b pb-4">Active Network Rules</h2>
        <div className="text-center py-20 text-red-500">
          <p>Failed to load rules. Please check your connection to the server.</p>
        </div>
      </div>
    );
  }

  if (!rules || Object.keys(rules).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-black text-2xl font-bold mb-6 border-b pb-4">Active Network Rules</h2>
        <div className="text-center py-20 text-gray-500">
          <p>No active rules found. Create one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-black text-2xl font-bold mb-6 border-b pb-4">Active Network Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(rules).map(([app, keywords]) => (
          <RulesGrid_Rule key={app} app={app} keywords={keywords} />
        ))}
      </div>
    </div>
  );
}
