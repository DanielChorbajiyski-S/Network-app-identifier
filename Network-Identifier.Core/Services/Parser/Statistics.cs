using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.Tracing;
using System.Linq;
using System.Text.Json;

namespace Network_Identifier.Core.Services.Parser
{
    public class Statistics
    {
        private const string KeyWordJson = "../Network-Identifier.Core/Data/KeyRules.json";
        public ConcurrentDictionary<string, long> PacketCounts { get; } = new();

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

        public ConcurrentDictionary<string, ConcurrentBag<string>> KeyWordRules { get; }

        public ConcurrentDictionary<string, ConcurrentDictionary<string, long>> CompanyProtocolCounts { get; } = new();

        public Statistics()
        {
            KeyWordRules = GetKeywordRulesFromJson();
        }

        public void IncrementPacketCount(string company)
        {
            PacketCounts.AddOrUpdate(
                company,
                1L,
                (_, oldValue) => oldValue + 1);
        }
        public void IncrementProtocolCount(string company, string protocol)
        {
            var protocolCounts = CompanyProtocolCounts.GetOrAdd(company, _ => new ConcurrentDictionary<string, long>());
            protocolCounts.AddOrUpdate(protocol, 1L, (_, oldValue) => oldValue + 1);
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

        public async Task AddDnsRule(string company, string keyword)
        {
            var bag = KeyWordRules.GetOrAdd(company, _ => new ConcurrentBag<string>());

            if (bag.Any(x => x.Equals(keyword, StringComparison.OrdinalIgnoreCase)))
                throw new ArgumentOutOfRangeException(nameof(keyword), "Rule keyword already exists for this company");

            bag.Add(keyword);
            await AddKeyWordRuleToJson();
        }

        public async Task AddRule(string company, string type, string keyword)
        {
            if (type == "Ip")
            {
                AddIpRule(company, keyword);
            }
            else if (type == "DnsKeyword")
            {
                await AddDnsRule(company, keyword);
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

        public Task<List<string>> GetKeywordRulesByApp(string app)
        {
            if (KeyWordRules.TryGetValue(app, out var keywords))
            {
                return Task.FromResult(keywords.ToList());
            }
            else
            {
                throw new ArgumentOutOfRangeException(nameof(app), "No keywords found for the specified app.");
            }
        }

        public Task<Dictionary<string, long>> GetPacketCount()
        {
            var snapshot = new Dictionary<string, long>(PacketCounts);
            return Task.FromResult(snapshot);

        }

        public Task<long> GetPacketCountByApp(string app)
        {
            if (PacketCounts.TryGetValue(app, out var count))
            {
                return Task.FromResult(count);
            }
            else
            {
                throw new ArgumentOutOfRangeException(nameof(app), "No packet count found for the specified app.");
            }
        }

        public Task<Dictionary<string, Dictionary<string, long>>> GetPacketProtocolCount()
        {
            var snapshot = CompanyProtocolCounts.ToDictionary(
                kvp => kvp.Key,
                kvp => new Dictionary<string, long>(kvp.Value)
            );
            return Task.FromResult(snapshot);
        }

        public Task<Dictionary<string, long>> GetPacketProtocolCountByApp(string app)
        {
            if (CompanyProtocolCounts.TryGetValue(app, out var protocolCounts))
            {
                return Task.FromResult(new Dictionary<string, long>(protocolCounts));
            }
            else
            {
                throw new ArgumentOutOfRangeException(nameof(app), "No protocol counts found for the specified app.");
            }
        }



        private static ConcurrentDictionary<string, ConcurrentBag<string>> GetKeywordRulesFromJson()
        {
            var json = File.ReadAllText(KeyWordJson);
            var data = JsonSerializer.Deserialize<Dictionary<string, string[]>>(json);

            if (data == null)
            {
                return new ConcurrentDictionary<string, ConcurrentBag<string>>();
            }

            return new ConcurrentDictionary<string, ConcurrentBag<string>>(
                data.Select(kvp =>
                    new KeyValuePair<string, ConcurrentBag<string>>(
                        kvp.Key,
                        new ConcurrentBag<string>(kvp.Value)
                    ))
            );
        }

        public async Task AddKeyWordRuleToJson()
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            string text = JsonSerializer.Serialize(KeyWordRules, options);

            await File.WriteAllTextAsync(KeyWordJson, text);

        }
 
    }
}