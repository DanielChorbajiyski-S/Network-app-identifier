using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Network_Identifier.Core.Services.Parser
{
    public class Statistics
    {
        public ConcurrentDictionary<string, int> PacketCounts { get; } = new();

        public ConcurrentDictionary<string, ConcurrentBag<string>> IpRules { get; } = new()
        {
            ["youtube"] = new ConcurrentBag<string> { "216.239.32.223" },

            ["instagram"] = new ConcurrentBag<string>
            {
                "157.240.234.18",
                "157.240.234.19",
                "157.240.234.63",
                "157.240.234.142"
            },

            ["google maps"] = new ConcurrentBag<string>
            {
                "216.239.38.135"
            }
        };

        public ConcurrentDictionary<string, ConcurrentBag<string>> KeyWordRules { get; } = new()
        {
            ["youtube"] = new ConcurrentBag<string> { "youtube", "googlevideo", "ytimg", "gstatic", "googlesyndication" },
            ["instagram"] = new ConcurrentBag<string> { "instagram", "fbcdn", "fbsbx", "cdninstagram" },
            ["google maps"] = new ConcurrentBag<string> { "mobilemaps.googleapis" },
            ["facebook"] = new ConcurrentBag<string> { "facebook", "fbcdn", "fbsbx" },
            ["x"] = new ConcurrentBag<string> { "twitter", "twimg", "x.com",},
            ["tiktok"] = new ConcurrentBag<string> { "tiktokcdn", "muscdn", "tiktokv.com", "ibytedtos.com", "ibyteimg.com" },
            ["linkedin"] = new ConcurrentBag<string> { "linkedin", "licdn" },
            ["snapchat"] = new ConcurrentBag<string> { "snapchat", "sc-cdn" },
            ["pinterest"] = new ConcurrentBag<string> { "pinterest", "pinimg" },
            ["reddit"] = new ConcurrentBag<string> { "reddit", "redd.it", "redditmedia" }
        };

        public void IncrementCount(string company)
        {
            PacketCounts.AddOrUpdate(
                company,
                1,
                (_, oldValue) => oldValue + 1);
        }

        public void AddIpRule(string company, string ip)
        {
            foreach (var kvp in IpRules)
            {
                if (kvp.Value.Any(x => x == ip))
                    throw new ArgumentOutOfRangeException(nameof(ip), "Rule IP already exists for another company");
            }

            var bag = IpRules.GetOrAdd(company, _ => new ConcurrentBag<string>());

            if (bag.Contains(ip))
                throw new ArgumentOutOfRangeException(nameof(ip), "Rule IP already exists for this company");

            bag.Add(ip);
        }

        public void AddDnsRule(string company, string keyword)
        {
            var bag = KeyWordRules.GetOrAdd(company, _ => new ConcurrentBag<string>());

            if (bag.Contains(keyword))
                throw new ArgumentOutOfRangeException(nameof(keyword), "Rule keyword already exists for this company");

            bag.Add(keyword);
        }

        public void AddRule(string company, string type, string keyword)
        {
            if (type == "Ip")
            {
                AddIpRule(company, keyword);
            }
            else if (type == "DnsKeyword")
            {
                AddDnsRule(company, keyword);
            }
            else
            {
                throw new ArgumentException("Invalid rule type. Must be 'Ip' or 'DnsKeyword'.", nameof(type));
            }
            
        }

        public Task<Dictionary<string, List<string>>> GetKeywordRules()
        {
            var rules = KeyWordRules.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToList());
            return Task.FromResult(rules);
        }

        public  Task<Dictionary<string, int>> GetSnapshot()
        {
            var snapshot = new Dictionary<string, int>(PacketCounts);
            return Task.FromResult(snapshot);
            
        }
    }
}