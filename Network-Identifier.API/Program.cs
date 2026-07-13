
using Network_Identifier.Core.Services.Parser;
using PacketDotNet;
using SharpPcap;
using System.Net.NetworkInformation;

namespace Network_Identifier.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSingleton<Statistics>();
            builder.Services.AddSingleton<DnsParser>();
            builder.Services.AddSingleton<PacketAnalyzer>();
            builder.Services.AddSingleton<PacketListener>();
            builder.Services.AddHostedService<PacketListenerService>();


            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
