import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SignatureRulePayload, RulesData } from '../types/rules';

export const useSignatureRules = () => {
  return useQuery<RulesData>({
    queryKey: ['signatureRules'],
    queryFn: async () => {
      const response = await fetch('/api/statistics/rules'); 
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
};

export const useAddSignatureRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleData: SignatureRulePayload) => {
      const response = await fetch('/api/statistics/rules/addRule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData),
      });
      
      if (!response.ok) throw new Error('Failed to save signature rule');
      return response.json();
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signatureRules'] });
    }
  });
};