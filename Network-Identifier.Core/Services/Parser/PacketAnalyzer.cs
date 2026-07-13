using Network_Identifier.Core.Services.Interfaces;
using PacketDotNet;
using SharpPcap;
using SharpPcap.LibPcap;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Parser
{
    public class PacketAnalyzer : IPacketAnalyzer
    {
        private long totalPackets = 0;
        private long tcpPackets = 0;
        private long udpPackets = 0;
        private long arpPackets = 0;
        private long ipv4Packets = 0;
        private long ipv6Packets = 0;

        private readonly Statistics statistics;
        private readonly DnsParser dnsParser;

        public PacketAnalyzer(Statistics statistics, DnsParser dnsParser)
        {
            this.statistics = statistics;
            this.dnsParser = dnsParser;
        }

        public string CheckIpMatch(string ip)
        {
            if (statistics.IpRules.TryGetValue(ip, out string company))
            {
                return company;
            }
            return null;
        }
        public void AnalyzePacket(RawCapture capture)
        {
            try
            {
                totalPackets++;
                string matchedApp = null;

                var rawPacket = capture;

                Packet packet = Packet.ParsePacket(
                    rawPacket.LinkLayerType,
                    rawPacket.Data);
                Console.WriteLine(
                    $"[{DateTime.Now:HH:mm:ss}] Packet #{totalPackets}");

                var ethernet = packet.Extract<EthernetPacket>();

                if (ethernet == null)
                    return;

                Console.WriteLine(
                        $"Ethernet  {ethernet.SourceHardwareAddress} -> {ethernet.DestinationHardwareAddress}");


                var ipv4 = packet.Extract<IPv4Packet>();

                if (ipv4 != null)
                {
                    ipv4Packets++;

                    var srcMatch = CheckIpMatch(ipv4.SourceAddress.ToString());
                    var dstMatch = CheckIpMatch(ipv4.DestinationAddress.ToString());

                    if (srcMatch != null) matchedApp = srcMatch;
                    if (dstMatch != null) matchedApp = dstMatch;

                    if (!string.IsNullOrEmpty(matchedApp))
                    {
                        statistics.IncrementProtocolCount(matchedApp, "IPv4");
                    }


                    Console.WriteLine(
                        $"IPv4 {ipv4.SourceAddress} -> {ipv4.DestinationAddress}");
                }

                var ipv6 = packet.Extract<IPv6Packet>();

                if (ipv6 != null)
                {
                    ipv6Packets++;

                    var srcMatch = CheckIpMatch(ipv6.SourceAddress.ToString());
                    var dstMatch = CheckIpMatch(ipv6.DestinationAddress.ToString());

                    if (srcMatch != null) matchedApp = srcMatch;
                    if (dstMatch != null) matchedApp = dstMatch;

                    if (!string.IsNullOrEmpty(matchedApp))
                    {
                        statistics.IncrementProtocolCount(matchedApp, "IPv6");
                    }

                    Console.WriteLine(
                        $"IPv6 {ipv6.SourceAddress} -> {ipv6.DestinationAddress}");
                }

                var tcp = packet.Extract<TcpPacket>();
                if (tcp != null)
                {
                    tcpPackets++;

                    if (matchedApp != null)
                    {
                        statistics.IncrementProtocolCount(matchedApp, "TCP");
                    }

                    Console.WriteLine(
                        $"TCP       {tcp.SourcePort} -> {tcp.DestinationPort}");
                }

                var udp = packet.Extract<UdpPacket>();

                if (udp != null)
                {
                    udpPackets++;

                    if (udp.SourcePort == 53 || udp.DestinationPort == 53)
                    {
                        byte[] data = udp.PayloadData;

                        if (data != null && data.Length > 0)
                        {
                            string? domain = dnsParser.TryParseDnsQuery(data);

                            if (!string.IsNullOrEmpty(domain))
                            {
                                Console.WriteLine($"DNS: {domain}");
                                var company = dnsParser.CheckDnsKeywordMatch(domain);

                                if (company != null)
                                {
                                    matchedApp = company;

                                    if (udp.SourcePort == 53)
                                    {
                                        foreach (var ip in dnsParser.ExtractIpsFromDnsAnswers(data))
                                        {
                                            try
                                            {
                                                statistics.AddIpRule(company, ip);
                                                Console.WriteLine($"  learned IP {ip} for {company}");
                                            }
                                            catch (ArgumentOutOfRangeException)
                                            {
                                                Console.WriteLine($"  IP {ip} already exists for another company");
                                            }
                                            catch (InvalidOperationException)
                                            {
                                                Console.WriteLine($"  Failed to add IP rule for {company}");
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        Console.WriteLine(
                        $"UDP       {udp.SourcePort} -> {udp.DestinationPort}");
                    }
                    if (matchedApp != null)
                    {
                        statistics.IncrementProtocolCount(matchedApp, "UDP");
                    }

                }
                // ARP
                var arp = packet.Extract<ArpPacket>();
                if (arp != null)
                {
                    arpPackets++;
                    if (matchedApp != null)
                    {
                        statistics.IncrementProtocolCount(matchedApp, "ARP");
                    }
                    Console.WriteLine("ARP Packet detected");
                }

                if (!string.IsNullOrEmpty(matchedApp))
                {
                    statistics.IncrementPacketCount(matchedApp);
                }
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Decode error: {ex.Message}");
            }
        }

        public void AnalyzePacketFromFile(string filePath)
        {
            if (!File.Exists(filePath))
            {
                Console.WriteLine($"Capture file not found: {filePath}");
                return;
            }

            Console.WriteLine($"Reading capture file: {filePath}");

            using var device = new CaptureFileReaderDevice(filePath);

            device.OnPacketArrival += (sender, e) =>
            {
                AnalyzePacket(e.GetPacket());
            };

            device.Open();

            device.Capture();

            device.Close();

            Console.WriteLine("Finished reading capture file.");

            foreach (var kvp in statistics.PacketCounts)
            {
                Console.WriteLine($"{kvp.Key}: {kvp.Value}");
            }
        }
    }
}
