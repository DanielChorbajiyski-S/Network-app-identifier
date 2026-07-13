import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

import { Icon } from '../common/Icon';
import { Loader } from '../common/Loader';
import { StackedTooltip } from './StackedTooltip';
import { usePacketStatistics } from '../../hooks/usePacketStatistics';
import { PROTOCOL_COLORS } from '../../constants/theme';

export default function PacketChart() {
  const { data: chartResult, isLoading, isError } = usePacketStatistics();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-125 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Packet Count by Application</h2>
        <div className="grow w-full h-full">
          <Loader className="h-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-125 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Packet Count by Application</h2>
        <div className="grow w-full h-full">
          <div className="flex justify-center items-center h-full text-red-500 font-medium">
            Failed to load statistics. Is the backend running?
          </div>
        </div>
      </div>
    );
  }

  if (!chartResult?.data || chartResult.data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-125 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Packet Count by Application</h2>
        <div className="grow w-full h-full">
          <div className="flex justify-center items-center h-full text-gray-500">
            No packet data available yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-125 flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Packet Count by Application</h2>
      <div className="grow w-full h-full">
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
                        {Icon(payload.value, "w-6 h-6 text-indigo-600")}
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
      </div>
    </div>
  );
}
