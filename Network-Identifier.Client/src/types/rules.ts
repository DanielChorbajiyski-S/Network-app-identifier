export interface SignatureRulePayload {
  appName: string;
  criterionType: string;
  value: string;
}

export type RulesData = Record<string, string[]>;