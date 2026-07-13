using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Network_Identifier.Core.Services.Interfaces
{
    public interface IStatistics
    {
        public void IncrementPacketCount(string company);
        public void IncrementProtocolCount(string company, string protocol);

        public void AddIpRule(string company, string ip);

        public  Task AddDnsRule(string company, string keyword);

        public  Task AddRule(string company, string type, string keyword);

        public Task<Dictionary<string, List<string>>> GetKeywordRules();

        public Task<List<string>> GetKeywordRulesByApp(string app);

        public Task<Dictionary<string, long>> GetPacketCount();

        public Task<long> GetPacketCountByApp(string app);

        public Task<Dictionary<string, Dictionary<string, long>>> GetPacketProtocolCount();

        public Task<Dictionary<string, long>> GetPacketProtocolCountByApp(string app);

        private static ConcurrentDictionary<string, ConcurrentBag<string>> GetKeywordRulesFromJson()
        {
            if (!File.Exists(KeyWordJson))
            {
                throw new FileNotFoundException($"The json file containing the keyword rules could not be found at {KeyWordJson}");
            }
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
