import { useQuery } from '@tanstack/react-query';
import type { QueryResult, ChartData } from '../types/network';

export const usePacketStatistics = () => {
  return useQuery<QueryResult>({
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
};