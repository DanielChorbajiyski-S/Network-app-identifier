using PacketDotNet;
using SharpPcap;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core
{
    public class TestPcap
    {
        public async Task testPcap()
        {
            Console.WriteLine("=== SharpPcap + PacketDotNet Test ===");
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
            Console.Write("Select interface number: ");

            if (!int.TryParse(Console.ReadLine(), out int selected) ||
                selected < 0 ||
                selected >= devices.Count)
            {
                Console.WriteLine("Invalid interface.");
                return;
            }

            var device = devices[selected];

            int totalPackets = 0;
            int tcpPackets = 0;
            int udpPackets = 0;
            int arpPackets = 0;
            int ipv4Packets = 0;
            int ipv6Packets = 0;

            Console.WriteLine();
            Console.WriteLine($"Opening: {device.Description}");

            device.Open();

            device.OnPacketArrival += (sender, e) =>
            {
                try
                {
                    totalPackets++;

                    var rawPacket = e.GetPacket();

                    Packet packet = Packet.ParsePacket(
                        rawPacket.LinkLayerType,
                        rawPacket.Data);

                    Console.WriteLine();
                    Console.WriteLine(
                        $"[{DateTime.Now:HH:mm:ss}] Packet #{totalPackets}");

                    // Ethernet
                    var ethernet = packet.Extract<EthernetPacket>();

                    if (ethernet != null)
                    {
                        Console.WriteLine(
                            $"Ethernet  {ethernet.SourceHardwareAddress} -> {ethernet.DestinationHardwareAddress}");
                    }

                    // IPv4
                    var ipv4 = packet.Extract<IPv4Packet>();

                    if (ipv4 != null)
                    {
                        ipv4Packets++;

                        Console.WriteLine(
                            $"IPv4      {ipv4.SourceAddress} -> {ipv4.DestinationAddress}");
                    }

                    // IPv6
                    var ipv6 = packet.Extract<IPv6Packet>();

                    if (ipv6 != null)
                    {
                        ipv6Packets++;

                        Console.WriteLine(
                            $"IPv6      {ipv6.SourceAddress} -> {ipv6.DestinationAddress}");
                    }

                    // TCP
                    var tcp = packet.Extract<TcpPacket>();

                    if (tcp != null)
                    {
                        tcpPackets++;

                        Console.WriteLine(
                            $"TCP       {tcp.SourcePort} -> {tcp.DestinationPort}");
                    }

                    // UDP
                    var udp = packet.Extract<UdpPacket>();

                    if (udp != null)
                    {
                        udpPackets++;

                        Console.WriteLine(
                            $"UDP       {udp.SourcePort} -> {udp.DestinationPort}");
                    }

                    // ARP
                    var arp = packet.Extract<ArpPacket>();

                    if (arp != null)
                    {
                        arpPackets++;

                        Console.WriteLine("ARP       Packet detected");
                    }
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

            await Task.Delay(TimeSpan.FromSeconds(15));

            device.StopCapture();
            device.Close();

            Console.WriteLine();
            Console.WriteLine("=== Capture Statistics ===");
            Console.WriteLine($"Total Packets : {totalPackets}");
            Console.WriteLine($"IPv4 Packets  : {ipv4Packets}");
            Console.WriteLine($"IPv6 Packets  : {ipv6Packets}");
            Console.WriteLine($"TCP Packets   : {tcpPackets}");
            Console.WriteLine($"UDP Packets   : {udpPackets}");
            Console.WriteLine($"ARP Packets   : {arpPackets}");
        }
    }
}
