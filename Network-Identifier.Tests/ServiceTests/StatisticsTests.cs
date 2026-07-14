using Network_Identifier.Core.Services.Parser;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Tests.ServiceTests
{
    public class StatisticsTests
    {
        [Fact]
        public void IncrementPacketCount_IncreasesCount()
        {
            
            var statistics = new Statistics();

            
            statistics.IncrementPacketCount("youtube");
            statistics.IncrementPacketCount("youtube");

            
            Assert.Equal(2, statistics.PacketCounts["youtube"]);
        }

        [Fact]
        public void IncrementProtocolCount_AddsProtocolCount()
        {
            
            var statistics = new Statistics();

            
            statistics.IncrementProtocolCount("youtube", "TCP");
            statistics.IncrementProtocolCount("youtube", "TCP");

            
            Assert.Equal(2, statistics.CompanyProtocolCounts["youtube"]["TCP"]);
        }

        [Fact]
        public void AddIpRule_AddsNewIpRule()
        {
            
            var statistics = new Statistics();

            
            statistics.AddIpRule(
                "netflix",
                "10.0.0.1");

            
            Assert.Equal(
                "netflix",
                statistics.IpRules["10.0.0.1"]);
        }

        [Fact]
        public void AddIpRule_Throws_WhenIpAlreadyExists()
        {
            
            var statistics = new Statistics();

            statistics.AddIpRule(
                "netflix",
                "10.0.0.1");


            
            Assert.Throws<ArgumentOutOfRangeException>(
                () =>
                statistics.AddIpRule(
                    "netflix",
                    "10.0.0.1"));
        }

        [Fact]
        public async Task GetPacketCount_ReturnsCounts()
        {
            
            var statistics = new Statistics();

            statistics.IncrementPacketCount("youtube");


            
            var result = await statistics.GetPacketCount();


            
            Assert.Equal(1, result["youtube"]);
        }

        [Fact]
        public async Task GetPacketCountByApp_Throws_WhenAppMissing()
        {
            var statistics = new Statistics();

            await Assert.ThrowsAsync<ArgumentOutOfRangeException>(
                () => statistics.GetPacketCountByApp("unknown"));
        }
    }
}
