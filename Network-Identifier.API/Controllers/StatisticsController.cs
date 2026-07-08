using Microsoft.AspNetCore.Mvc;
using Network_Identifier.API.Models;
using Network_Identifier.Core.Services.Parser;

namespace Network_Identifier.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly Statistics statistics;
        public StatisticsController(Statistics statistics)
        {
            this.statistics = statistics;
        }


        [HttpGet("rules")]
        public async Task<IActionResult> GetKeywordRules()
        {
            Dictionary<string, List<string>> rules = await statistics.GetKeywordRules();
            if (rules == null)
            {
                return NoContent();
            }
            return Ok(rules);
        }

        [HttpGet("packetCount")]
        public async Task<IActionResult> GetPacketCountStatistics()
        {
            Dictionary<string, int> statisticsData = await statistics.GetPacketCount();
            if (statisticsData == null)
            {
                return NoContent();
            }
            return Ok(statisticsData);
        }

        [HttpGet("packetCount/{appName}")]
        public async Task<IActionResult> GetPacketCountByApp([FromRoute] string appName)
        {
            int packetCount = await statistics.GetPacketCountByApp(appName);
            return Ok(new { AppName = appName, PacketCount = packetCount });
        }

        [HttpGet("packetProtocolCount")]
        public async Task<IActionResult> GetPacketProtocolCount()
        {
            Dictionary<string, Dictionary<string, int>> statisticsData = await statistics.GetPacketProtocolCount();
            if (statisticsData == null)
            {
                return NoContent();
            }
            return Ok(statisticsData);
        }

        [HttpGet("packetProtocolCount/{appName}")]
        public async Task<IActionResult> GetPacketProtocolCountByApp([FromRoute] string appName)
        {
            Dictionary<string, int> protocolCounts = await statistics.GetPacketProtocolCountByApp(appName);
            return Ok(new { AppName = appName, ProtocolCounts = protocolCounts });
        }

        [HttpPost("rules/addRule")]
        public async Task<IActionResult> AddRule([FromBody] AddRuleDTO rule)
        {
            if (!ModelState.IsValid || rule == null)
            {
                return BadRequest("Invalid rule data.");
            }
            try
            {
                await statistics.AddRule(rule.AppName, rule.Type, rule.Rule);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
            return Ok(new { message = "Added rule successfully." });
        }
    }
}
