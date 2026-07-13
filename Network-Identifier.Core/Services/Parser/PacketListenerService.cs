using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Parser
{
    public class PacketListenerService : BackgroundService
    {
        private readonly PacketListener _listener;
        private readonly PacketAnalyzer _analyzer;
        private readonly IConfiguration configuration;
        private string? filePath;


        public PacketListenerService (PacketListener packetListener, IConfiguration configuration, PacketAnalyzer packetAnalyzer)
        {
            this.configuration = configuration;
            _listener = packetListener;
            _analyzer = packetAnalyzer;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!string.IsNullOrWhiteSpace(configuration["CaptureSettings:CaptureFileLocation"]))
            {
                string? relativePath = configuration["CaptureSettings:CaptureFileLocation"];

                filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                relativePath!)!.ToString();

                if (File.Exists(filePath))
                {
                    _analyzer.AnalyzePacketFromFile(filePath);
                }
                else
                {
                    throw new FileNotFoundException($"The specified capture file '{filePath}' does not exist.");
                }
                
            }
            else
            {
                await _listener.Listen(stoppingToken);
            }
        }
    }
}
