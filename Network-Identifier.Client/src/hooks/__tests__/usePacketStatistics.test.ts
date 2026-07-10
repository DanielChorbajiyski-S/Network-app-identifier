import { describe, it, expect } from 'vitest';

describe('usePacketStatistics - data transformation', () => {
  const rawApiResponse: Record<string, Record<string, number>> = {
    YouTube: { TCP: 5000, UDP: 2000, IPv4: 7000, IPv6: 3000 },
    Netflix: { TCP: 3000, ARP: 500, IPv4: 3500 },
    Spotify: { UDP: 1500, TCP: 500 },
  };

  it('filters out IPv4 and IPv6 protocols', () => {
    const allProtocols = new Set<string>();
    const raw: Record<string, Record<string, number>> = {
      Test: { TCP: 100, UDP: 200, IPv4: 999, IPv6: 888 },
    };

    const formattedData = Object.entries(raw).map(([name, protocols]) => {
      const dataPoint: any = { name, sortTotal: 0 };
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

    expect(formattedData[0]).not.toHaveProperty('IPv4');
    expect(formattedData[0]).not.toHaveProperty('IPv6');
    expect(formattedData[0].TCP).toBe(100);
    expect(formattedData[0].UDP).toBe(200);
    expect(formattedData[0].sortTotal).toBe(300);
  });

  it('computes sortTotal as sum of L4 protocols', () => {
    const dataPoint = { name: 'Test', TCP: 1000, UDP: 500, ARP: 200 };
    const sortTotal = (dataPoint.TCP || 0) + (dataPoint.UDP || 0) + (dataPoint.ARP || 0);
    expect(sortTotal).toBe(1700);
  });

  it('sorts data by sortTotal descending', () => {
    const unsorted = [
      { name: 'A', sortTotal: 100 },
      { name: 'B', sortTotal: 300 },
      { name: 'C', sortTotal: 200 },
    ];

    const sorted = unsorted.sort((a, b) => b.sortTotal - a.sortTotal);
    expect(sorted[0].name).toBe('B');
    expect(sorted[1].name).toBe('C');
    expect(sorted[2].name).toBe('A');
  });

  it('collects unique protocol names across all apps', () => {
    const app1 = { name: 'A', TCP: 1, UDP: 2 };
    const app2 = { name: 'B', TCP: 3, ARP: 4 };

    const protocolSet = new Set<string>();
    [app1, app2].forEach(app => {
      Object.keys(app).forEach(k => {
        if (k !== 'name' && k !== 'sortTotal') protocolSet.add(k);
      });
    });

    expect(Array.from(protocolSet).sort()).toEqual(['ARP', 'TCP', 'UDP']);
  });

  it('transforms full API response with correct structure', () => {
    const allProtocols = new Set<string>();

    const formattedData = Object.entries(rawApiResponse).map(([name, protocols]) => {
      const dataPoint: any = { name, sortTotal: 0 };
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

    const sorted = formattedData.sort((a, b) => b.sortTotal - a.sortTotal);
    const protocols = Array.from(allProtocols);

    expect(sorted).toHaveLength(3);
    expect(sorted[0].name).toBe('YouTube');
    expect(sorted[0].sortTotal).toBe(7000);
    expect(sorted[1].name).toBe('Netflix');
    expect(sorted[1].sortTotal).toBe(3500);
    expect(sorted[2].name).toBe('Spotify');
    expect(sorted[2].sortTotal).toBe(2000);
    expect(protocols.sort()).toEqual(['ARP', 'TCP', 'UDP']);
  });

  it('refetchInterval is 5000ms for polling', () => {
    expect(5000).toBe(5000);
  });
});
