// Hook personnalisé pour l'assistant IA
import { useState } from 'react';
import { generateDesignFromPrompt } from '@/lib/ai/designGenerator';
import { StandConfiguration } from '@/types/modules';

interface UseAIGeneratorOptions {
  onSuccess?: (configurations: StandConfiguration[]) => void;
  onError?: (error: Error) => void;
}

export function useAIGenerator(options?: UseAIGeneratorOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [configurations, setConfigurations] = useState<StandConfiguration[]>([]);

  const generate = async (prompt: string, additionalParams?: {
    dimensions?: { width: number; depth: number };
    budget?: number;
    industry?: string;
    style?: string;
    requirements?: string[];
  }) => {
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = localStorage.getItem('openai_api_key') || '';
      
      if (!apiKey) {
        // Mode démo sans API
        const mockConfig: StandConfiguration = {
          name: 'Stand Généré (Demo)',
          description: `Configuration basée sur: ${prompt}`,
          dimensions: additionalParams?.dimensions || { width: 6, depth: 3 },
          modules: [],
          backgroundColor: '#f5f5f5',
          floorMaterial: { type: 'color', value: '#e8e8e8' },
          style: (additionalParams?.style as any) || 'modern',
          industry: additionalParams?.industry,
          totalPrice: 0
        };
        
        setConfigurations([mockConfig]);
        options?.onSuccess?.([mockConfig]);
        return [mockConfig];
      }

      const result = await generateDesignFromPrompt(
        {
          prompt,
          ...additionalParams
        },
        apiKey
      );

      setConfigurations(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur de génération');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setError(null);
    setConfigurations([]);
  };

  return {
    generate,
    reset,
    isGenerating,
    error,
    configurations
  };
}
