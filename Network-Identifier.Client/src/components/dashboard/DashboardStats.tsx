import { usePacketStatistics } from '../../hooks/usePacketStatistics';
import { DashboardStats_Card } from './DashboardStats_Card';

export default function DashboardStats() {
  const { data: chartResult, isLoading } = usePacketStatistics();

  const totalPackets = chartResult?.data.reduce((sum, item) => sum + item.sortTotal, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardStats_Card
        title="Total Packets Identified"
        value={totalPackets.toLocaleString()}
        isLoading={isLoading}
      />
      <DashboardStats_Card
        title="Apps Tracked"
        value={chartResult?.data.length || 0}
        colorClass="text-gray-900"
        isLoading={isLoading}
      />
    </div>
  );
}
