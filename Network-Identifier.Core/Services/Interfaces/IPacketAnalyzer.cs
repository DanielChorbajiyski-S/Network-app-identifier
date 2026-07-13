using Network_Identifier.Core.Services.Parser;
using PacketDotNet;
using SharpPcap;
using SharpPcap.LibPcap;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Interfaces
{
    public interface IPacketAnalyzer
    {
        public string CheckIpMatch(string ip);
        public void AnalyzePacket(RawCapture capture);

        public void AnalyzePacketFromFile(string filePath);
    }
}
