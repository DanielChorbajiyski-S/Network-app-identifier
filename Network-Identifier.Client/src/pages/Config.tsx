import RuleForm from '../components/config/RuleForm';
import RulesGrid from '../components/config/RulesGrid';

export default function Config() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-4">
          <RuleForm />
        </div>

        <div className="lg:col-span-8">
          <RulesGrid />
        </div>
        
      </div>
    </div>
  );
}