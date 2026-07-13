using Network_Identifier.Core.Services.Parser;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Interfaces
{
    public interface IDnsParser
    {
        public string CheckDnsKeywordMatch(string domain);

        public int SkipDnsName(byte[] data, int pos);

        public List<string> ExtractIpsFromDnsAnswers(byte[] data);
    }
}
