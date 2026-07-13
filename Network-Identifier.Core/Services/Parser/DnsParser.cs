using Network_Identifier.Core.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Parser
{
    public class DnsParser : IDnsParser
    {
        private readonly Statistics statistics;
        public DnsParser(Statistics statistics)
        {
            this.statistics = statistics;
        }

        public string CheckDnsKeywordMatch(string domain)
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
        public string? TryParseDnsQuery(byte[] data)
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

        public int SkipDnsName(byte[] data, int pos)
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

        public List<string> ExtractIpsFromDnsAnswers(byte[] data)
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
    }
}
