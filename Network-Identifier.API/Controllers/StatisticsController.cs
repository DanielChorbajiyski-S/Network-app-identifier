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

        [HttpGet("snapshot")]
        public async Task<IActionResult> GetStatistics()
        {
            Dictionary<string, int> statisticsData = await statistics.GetSnapshot();
            if (statisticsData == null)
            {
                return NoContent();
            }
            return Ok(statisticsData);
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
                statistics.AddRule(rule.AppName, rule.Type, rule.Rule);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
            return Ok("Added rule successfully.");
        }
    }
}
