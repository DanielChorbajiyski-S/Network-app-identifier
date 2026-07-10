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
        private readonly IConfiguration configuration;
        private string? filePath;


        public PacketListenerService(Statistics statistics, IConfiguration configuration)
        {
            this.configuration = configuration;
            _listener = new PacketListener(statistics, configuration);
            
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (configuration["CaptureSettings:CaptureFileLocation"] != null && configuration["CaptureSettings:CaptureFileLocation"] != "")
            {
                string relativePath = configuration["CaptureSettings:CaptureFileLocation"];

                filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                relativePath!)!.ToString();

                _listener.AnalyzePacketFromFile(filePath);
            }
            else
            {
                await _listener.Listen(stoppingToken);
            }
        }
    }
}
