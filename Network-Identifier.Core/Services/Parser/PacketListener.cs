using Microsoft.Extensions.Configuration;
using PacketDotNet;
using SharpPcap;
using SharpPcap.LibPcap;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Text;

namespace Network_Identifier.Core.Services.Parser
{

    public class PacketListener
    {
        private readonly Statistics statistics;
        private readonly IConfiguration configuration;
        private readonly DnsParser dnsParser;
        private readonly PacketAnalyzer packetAnalyzer;

        public PacketListener(Statistics statistics, IConfiguration configuration, DnsParser dnsParser, PacketAnalyzer packetAnalyzer)
        {
            this.statistics = statistics;
            this.configuration = configuration;
            this.dnsParser = dnsParser;
            this.packetAnalyzer = packetAnalyzer;
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

            //Console.WriteLine("Available Interfaces:");
            //Console.WriteLine();

            //for (int i = 0; i < devices.Count; i++)
            //{
            //    Console.WriteLine($"[{i}] {devices[i].Description}");
            //}

            //Console.WriteLine();
            //Console.Write("Select interface number: ");

            //if (!int.TryParse(Console.ReadLine(), out int selected) ||
            //    selected < 0 ||
            //    selected >= devices.Count)
            //{
            //    Console.WriteLine("Invalid interface.");
            //    return;
            //}

            string? preferredInterface = configuration["Capture:PreferredInterface"];

            ICaptureDevice? device = devices.FirstOrDefault(d =>
                d.Description != null &&
                preferredInterface != null &&
                d.Description.Contains(preferredInterface, StringComparison.OrdinalIgnoreCase));

            device ??= devices.FirstOrDefault(d =>
                d.Description != null &&
                !d.Description.Contains("Loopback", StringComparison.OrdinalIgnoreCase));

            device ??= devices.First();

            Console.WriteLine();
            Console.WriteLine($"Opening: {device.Description}");

            device.Open();

            device.OnPacketArrival += (sender, e) =>
            {
                packetAnalyzer.AnalyzePacket(e.GetPacket());
            };

            Console.WriteLine();
            Console.WriteLine("Capturing...");
            Console.WriteLine("Open a website, run ping, or stream a video.");
            Console.WriteLine();

            device.StartCapture();

            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
                //await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
            catch (TaskCanceledException)
            {

            }
            finally
            {
                device.StopCapture();
                device.Close();
            }

            foreach (var kvp in statistics.PacketCounts)
            {
                Console.WriteLine($"{kvp.Key}: {kvp.Value}");
            }

        }

    }   

}
