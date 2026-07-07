using PacketDotNet;
using SharpPcap;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Text;

namespace Network_Identifier.Core.Services.Parser
{
    public class PacketListener(Statistics statistics)
    {

        private string CheckIpMatch(string ip)
        {
            foreach (var kvp in statistics.IpRules)
            {
                if (kvp.Value.Contains(ip))
                {
                    //statistics.IncrementCount(kvp.Key);
                    return kvp.Key;
                }
            }
            return null;
        }
        private string CheckDnsKeywordMatch(string domain)
        {
            foreach (var rule in statistics.KeyWordRules)
            {
                if (rule.Value.Any(keyword => domain.Contains(keyword)))
                {
                    return rule.Key;
                }
            }
            return null;
        }
        private string? TryParseDnsQuery(byte[] data)
        {
            try
            {
                if (data == null || data.Length < 12)
                    return null;

                int position = 12;

                StringBuilder domain = new StringBuilder();

                while (position < data.Length)
                {
                    int length = data[position++];

                    if (length == 0)
                        break;

                    if (domain.Length > 0)
                        domain.Append('.');

                    if (position + length > data.Length)
                        return null;

                    for (int i = 0; i < length; i++)
                    {
                        domain.Append((char)data[position++]);
                    }
                }

                return domain.ToString();
            }
            catch
            {
                return null;
            }
        }

        private int SkipDnsName(byte[] data, int pos)
        {
            while (pos < data.Length)
            {
                int len = data[pos];
                if (len == 0) { pos++; break; }
                if ((len & 0xC0) == 0xC0) { pos += 2; break; } // compressed pointer
                pos += 1 + len;
            }
            return pos;
        }

        private List<string> ExtractIpsFromDnsAnswers(byte[] data)
        {
            var ips = new List<string>();
            try
            {
                if (data == null || data.Length < 12) return ips;

                int qdcount = (data[4] << 8) | data[5];
                int ancount = (data[6] << 8) | data[7];
                int pos = 12;

                for (int q = 0; q < qdcount; q++)
                {
                    pos = SkipDnsName(data, pos);
                    pos += 4; // qtype + qclass
                }

                for (int a = 0; a < ancount; a++)
                {
                    pos = SkipDnsName(data, pos);
                    if (pos + 10 > data.Length) break;

                    int type = (data[pos] << 8) | data[pos + 1];
                    pos += 8; // type(2) + class(2) + ttl(4)

                    int rdlength = (data[pos] << 8) | data[pos + 1];
                    pos += 2;

                    if (pos + rdlength > data.Length) break;

                    if (type == 1 && rdlength == 4) // A record
                        ips.Add($"{data[pos]}.{data[pos + 1]}.{data[pos + 2]}.{data[pos + 3]}");

                    pos += rdlength;
                }
            }
            catch { }
            return ips;
        }
        public async Task Listen(CancellationToken stoppingToken)
        {
            Console.WriteLine("=== SharpPcap + PacketDotNet Listening ===");
            Console.WriteLine();

            var devices = CaptureDeviceList.Instance;

            if (devices.Count == 0)
            {
                Console.WriteLine("No capture devices found.");
                return;
            }

            Console.WriteLine("Available Interfaces:");
            Console.WriteLine();

            for (int i = 0; i < devices.Count; i++)
            {
                Console.WriteLine($"[{i}] {devices[i].Description}");
            }

            Console.WriteLine();
            //Console.Write("Select interface number: ");

            //if (!int.TryParse(Console.ReadLine(), out int selected) ||
            //    selected < 0 ||
            //    selected >= devices.Count)
            //{
            //    Console.WriteLine("Invalid interface.");
            //    return;
            //}

            var device = devices[5];

            int totalPackets = 0;
            int tcpPackets = 0;
            int udpPackets = 0;
            int arpPackets = 0;
            int ipv4Packets = 0;
            int ipv6Packets = 0;

            Console.WriteLine();
            Console.WriteLine($"Opening: {device.Description}");

            device.Open();
            PhysicalAddress? phoneMac = null;

            device.OnPacketArrival += (sender, e) =>
            {
                try
                {
                    totalPackets++;
                    string matchedApp = null;

                    var rawPacket = e.GetPacket();

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

                    if (phoneMac == null)
                    {
                        phoneMac = ethernet.SourceHardwareAddress;
                        Console.WriteLine($"Phone MAC detected: {phoneMac}");
                    }

                    if (!ethernet.SourceHardwareAddress.Equals(phoneMac) &&
                        !ethernet.DestinationHardwareAddress.Equals(phoneMac))
                    {
                        return;
                    }

                    var ipv4 = packet.Extract<IPv4Packet>();

                    if (ipv4 != null)
                    {
                        ipv4Packets++;

                        var srcMatch = CheckIpMatch(ipv4.SourceAddress.ToString());
                        var dstMatch = CheckIpMatch(ipv4.DestinationAddress.ToString());

                        if (srcMatch != null) matchedApp = srcMatch;
                        if (dstMatch != null) matchedApp = dstMatch;

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

                        Console.WriteLine(
                            $"IPv6 {ipv6.SourceAddress} -> {ipv6.DestinationAddress}");
                    }

                    var tcp = packet.Extract<TcpPacket>();
                    if (tcp != null)
                    {
                        tcpPackets++;

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
                                string? domain = TryParseDnsQuery(data);

                                if (!string.IsNullOrEmpty(domain))
                                {
                                    Console.WriteLine($"DNS: {domain}");
                                    var company = CheckDnsKeywordMatch(domain);

                                    if (company != null)
                                    {
                                        matchedApp = company;

                                        if (udp.SourcePort == 53) // it's a response, not a query
                                        {
                                            foreach (var ip in ExtractIpsFromDnsAnswers(data))
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
                                                //if (statistics.AddIpRule(company, ip))
                                                //{
                                                //    Console.WriteLine($"  learned IP {ip} for {company}");
                                                //}
                                                    
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
                        
                    }
                    // ARP
                    var arp = packet.Extract<ArpPacket>();
                    if (arp != null)
                    {
                        arpPackets++;
                        Console.WriteLine("ARP Packet detected");
                    }

                    if (!string.IsNullOrEmpty(matchedApp))
                    {
                        statistics.IncrementCount(matchedApp);
                    }
                    Console.WriteLine();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Decode error: {ex.Message}");
                }
            };

            Console.WriteLine();
            Console.WriteLine("Capturing for 15 seconds...");
            Console.WriteLine("Open a website, run ping, or stream a video.");
            Console.WriteLine();

            device.StartCapture();

            try
            {
                //await Task.Delay(Timeout.Infinite, stoppingToken);
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (TaskCanceledException)
            {

            }
            finally
            {
                device.StopCapture();
                device.Close();
            }

            Console.WriteLine();
            Console.WriteLine("=== Capture Statistics ===");
            Console.WriteLine($"Total Packets : {totalPackets}");
            Console.WriteLine($"IPv4 Packets  : {ipv4Packets}");
            Console.WriteLine($"IPv6 Packets  : {ipv6Packets}");
            Console.WriteLine($"TCP Packets   : {tcpPackets}");
            Console.WriteLine($"UDP Packets   : {udpPackets}");
            Console.WriteLine($"ARP Packets   : {arpPackets}");
            Console.WriteLine();
            Console.WriteLine("===Stats===");
            foreach (var kvp in statistics.PacketCounts)
            {
                Console.WriteLine($"{kvp.Key}: {kvp.Value}");
            }

        }
    }
    
}
