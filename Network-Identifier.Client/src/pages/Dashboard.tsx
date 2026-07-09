import DashboardStats from '../components/dashboard/DashboardStats';
import PacketChart from '../components/dashboard/PacketChart';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Traffic Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time packet capture statistics</p>
        </div>

        <DashboardStats />
        
        <PacketChart />

      </div>
    </div>
  );
}