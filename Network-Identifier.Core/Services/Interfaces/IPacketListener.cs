using System;
using System.Collections.Generic;
using System.Text;

namespace Network_Identifier.Core.Services.Interfaces
{
    public interface IPacketListener
    {
        public Task Listen(CancellationToken stoppingToken);
    }
}
