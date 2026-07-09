import { usePacketStatistics } from '../../hooks/usePacketStatistics';

export default function DashboardStats() {
  const { data: chartResult, isLoading } = usePacketStatistics();

  const totalPackets = chartResult?.data.reduce((sum, item) => sum + item.sortTotal, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Packets Identified</h3>
        <p className="text-3xl font-bold text-indigo-600 mt-2">
          {isLoading ? '...' : totalPackets.toLocaleString()}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-500">Apps Tracked</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {isLoading ? '...' : chartResult?.data.length || 0}
        </p>
      </div>
    </div>
  );
}