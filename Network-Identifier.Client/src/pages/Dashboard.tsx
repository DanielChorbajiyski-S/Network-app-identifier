import { useQuery } from '@tanstack/react-query';
import { getAppIcon } from '../components/common/iconUtils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ChartData {
  name: string;
  count: number;
}

export default function Dashboard() {
  const { data: chartData, isLoading, isError } = useQuery<ChartData[]>({
    queryKey: ['packetCount'],
    queryFn: async () => {
      const response = await fetch('/api/statistics/packetCount');
      
      if (!response.ok) {
        throw new Error('Failed to fetch packet counts');
      }
      
      const rawData: Record<string, number> = await response.json();
      
      const formattedData = Object.entries(rawData).map(([name, count]) => ({
        name,
        count
      }));
      
      return formattedData.sort((a, b) => b.count - a.count);
    },
    refetchInterval: 5000
  });

  const totalPackets = chartData?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Traffic Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time packet capture statistics</p>
        </div>

        {/* Quick Stats Cards */}
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
              {isLoading ? '...' : chartData?.length || 0}
            </p>
          </div>
        </div>

        {/* Main Chart Widget */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-125 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Packet Count by Application</h2>
          
          <div className="grow w-full h-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center h-full text-red-500 font-medium">
                Failed to load statistics. Is the backend running?
              </div>
            ) : !chartData || chartData.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                No packet data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={(props: any) => {
                      const { x, y, payload } = props;
                      return (
                        <g transform={`translate(${x},${y + 15})`}>
                          <foreignObject x={-12} y={0} width={24} height={24}>
                            {/* Render the icon */}
                            <div className="flex justify-center">
                              {getAppIcon(payload.value, "w-6 h-6 text-indigo-600")}
                            </div>
                          </foreignObject>
                        </g>
                      );
                    }}
                    dy={20}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#4F46E5' : '#6366F1'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}