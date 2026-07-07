using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Network_Identifier.API.Models
{
    public class AddRuleDTO
    {
        private string appName = string.Empty;
        [Required( ErrorMessage = "App name is required" )]
        [JsonPropertyName("appName")]
        public string AppName
        {
            get => appName;
            set => appName = value?.ToLower() ?? string.Empty;
        }

        [Required ( ErrorMessage = "Criterion type is required" )]
        [AllowedValues("DnsKeyword", "Ip")]
        [JsonPropertyName("criterionType")]
        public string Type { get; set; } = string.Empty;

        [Required ( ErrorMessage = "Rule value is required" )]
        [JsonPropertyName("value")]
        public string Rule { get; set; } = string.Empty; 
        
    }
}
