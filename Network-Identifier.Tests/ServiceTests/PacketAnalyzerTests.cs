using Network_Identifier.Core.Services.Parser;
using PacketDotNet;
using SharpPcap;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;

namespace Network_Identifier.Tests.ServiceTests
{
    public class PacketAnalyzerTests
    {
        private Statistics statistics;
        private DnsParser dnsParser;
        private PacketAnalyzer analyzer;


        public PacketAnalyzerTests()
        {
            statistics = new Statistics();
            dnsParser = new DnsParser(statistics);
            analyzer = new PacketAnalyzer(statistics, dnsParser);
        }

        [Fact]
        public void CheckIpMatch_ReturnsCompany_WhenIpExists()
        {
            statistics.IpRules.TryAdd("8.8.8.8", "google");

            
            var result = analyzer.CheckIpMatch("8.8.8.8");

            Assert.Equal("google", result);
        }

        [Fact]
        public void CheckIpMatch_ReturnsNull_WhenIpDoesNotExist()
        {
            var result = analyzer.CheckIpMatch("8.8.8.8");
            Assert.Null(result);
        }

        [Fact]
        public void AnalyzePacket_UpdatesStatistics_WhenKnownIpFound()
        {
            statistics.IpRules.TryAdd("8.8.8.8", "google");

            var ethernetPacket = new EthernetPacket(
                PhysicalAddress.Parse("00-11-22-33-44-55"),
                PhysicalAddress.Parse("AA-BB-CC-DD-EE-FF"),
                EthernetType.IPv4);

            var ipv4Packet = new IPv4Packet(
                IPAddress.Parse("192.168.1.10"),
                IPAddress.Parse("8.8.8.8"));

            ethernetPacket.PayloadPacket = ipv4Packet;

            var rawCapture = new RawCapture(
                LinkLayers.Ethernet,
                new PosixTimeval(DateTime.Now),
                ethernetPacket.Bytes);

            analyzer.AnalyzePacket(rawCapture);
                
            Assert.True(
                statistics.PacketCounts.ContainsKey("google"));

        }
    }
}
