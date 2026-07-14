using Network_Identifier.Core.Services.Parser;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Tests.ServiceTests
{
    public class DnsParserTests
    {
        private readonly Statistics statistics;
        private readonly DnsParser dnsParser;
        public DnsParserTests()
        {
            statistics = new Statistics();
            dnsParser = new DnsParser(statistics);
        }


        [Fact]
        public void CheckDnsKeywordMatch_ReturnsCompany_WhenKeywordFound()
        {
            
            statistics.KeyWordRules.TryAdd(
                "testApp",
                new ConcurrentBag<string> { "tstapp" });

            
            var result = dnsParser.CheckDnsKeywordMatch(
                "www.tstappapi.com");

            Assert.Equal("testApp", result);
        }


        [Fact]
        public void CheckDnsKeywordMatch_ReturnsNull_WhenNoKeywordFound()
        {
            
            var result = dnsParser.CheckDnsKeywordMatch(
                "www.example.com");

            Assert.Null(result);
        }


        [Fact]
        public void TryParseDnsQuery_ReturnsDomain_WhenValidDnsData()
        {
            
            byte[] data =
            {
            0, 0,
            0, 0,
            0, 1,
            0, 0,
            0, 0,
            0, 0,

            // www.youtube.com
            3, (byte)'w', (byte)'w', (byte)'w',
            7, (byte)'y', (byte)'o', (byte)'u',
                (byte)'t', (byte)'u', (byte)'b', (byte)'e',
            3, (byte)'c', (byte)'o', (byte)'m',
            0
        };
            
            var result = dnsParser.TryParseDnsQuery(data);
            
            Assert.Equal(
                "www.youtube.com",
                result);
        }


        [Fact]
        public void TryParseDnsQuery_ReturnsNull_WhenDataTooShort()
        {
            
            byte[] data =
            {
            0, 1, 2
        };
            
            var result = dnsParser.TryParseDnsQuery(data);
            
            Assert.Null(result);
        }


        [Fact]
        public void SkipDnsName_SkipsNormalDnsName()
        {
            
            byte[] data =
            {
            3, (byte)'w', (byte)'w', (byte)'w',
            0
        };

            var result = dnsParser.SkipDnsName(data, 0);

            Assert.Equal(5, result);
        }


        [Fact]
        public void ExtractIpsFromDnsAnswers_ReturnsEmptyList_WhenInvalidData()
        {
            
            byte[] data =
            {
            0, 1, 2
        };
            
            var result = dnsParser.ExtractIpsFromDnsAnswers(data);
            
            Assert.Empty(result);
        }
        
    }
}
