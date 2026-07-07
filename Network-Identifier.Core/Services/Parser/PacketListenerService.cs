using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Parser
{
    public class PacketListenerService : BackgroundService
    {
        private readonly PacketListener _listener;

        public PacketListenerService(Statistics statistics)
        {
            _listener = new PacketListener(statistics);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // runs automatically on app startup
            await _listener.Listen(stoppingToken);
        }
    }
}
