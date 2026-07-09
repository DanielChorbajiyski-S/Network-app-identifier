import { useQuery } from '@tanstack/react-query';
import { getAppIcon } from '../components/common/iconUtils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const PROTOCOL_COLORS: Record<string, string> = {
  TCP: '#312E81',    // Indigo 900
  UDP: '#6366F1',    // Indigo 500
  ARP: '#A5B4FC',    // Indigo 300
  IPv4: '#4338CA',   // Indigo 700
  IPv6: '#818CF8',   // Indigo 400
  Other: '#E0E7FF'   // Indigo 100
};

interface ChartData {
  name: string;
  sortTotal: number;
  [key: string]: any; 
}

interface QueryResult {
  data: ChartData[];
  protocols: string[];
}

const StackedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

    return (
      <div className="bg-white text-gray-900 p-4 rounded-xl shadow-xl border border-gray-200 pointer-events-none min-w-40">
        <p className="font-bold text-lg text-gray-800 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
          {label}
        </p>
        
        <div className="space-y-1.5 mb-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center text-sm gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-600 font-medium">{entry.name}</span>
              </div>
              <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total</span>
          <span className="text-indigo-600 font-bold text-lg">{total.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: chartResult, isLoading, isError } = useQuery<QueryResult>({
    queryKey: ['packetProtocolCount'],
    queryFn: async () => {
      const response = await fetch('/api/statistics/packetProtocolCount');
      
      if (!response.ok) {
        throw new Error('Failed to fetch protocol counts');
      }
      
      const rawData: Record<string, Record<string, number>> = await response.json();
      const allProtocols = new Set<string>();
      
      const formattedData = Object.entries(rawData).map(([name, protocols]) => {
        const dataPoint: ChartData = { name, sortTotal: 0 };
        let totalL4 = 0;
        
        Object.entries(protocols).forEach(([protocol, count]) => {

          if (protocol === 'IPv4' || protocol === 'IPv6') return;

          allProtocols.add(protocol);
          dataPoint[protocol] = count;
          totalL4 += count;
        });
        
        dataPoint.sortTotal = totalL4; 
        return dataPoint;
      });
      
      return {
        data: formattedData.sort((a, b) => b.sortTotal - a.sortTotal),
        protocols: Array.from(allProtocols) 
      };
    },
    
    refetchInterval: 5000
  });

  const totalPackets = chartResult?.data.reduce((sum, item) => sum + item.sortTotal, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Traffic Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time packet capture statistics</p>
        </div>

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
            ) : !chartResult?.data || chartResult.data.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                No packet data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartResult.data}
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
                    content={<StackedTooltip />}
                    cursor={{ fill: '#F3F4F6', opacity: 0.5 }} 
                  />
                  {chartResult.protocols.map((protocol) => (
                    <Bar 
                      key={protocol}
                      dataKey={protocol} 
                      stackId="a" 
                      fill={PROTOCOL_COLORS[protocol] || PROTOCOL_COLORS.Other}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}