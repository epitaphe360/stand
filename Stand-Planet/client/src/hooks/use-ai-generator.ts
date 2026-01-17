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
        // Mode démo sans API - utiliser la génération par défaut
        // qui crée une vraie configuration avec des modules
        const defaultConfig = await generateDesignFromPrompt(
          {
            prompt,
            ...additionalParams
          },
          '' // Pas d'API key - utilisera getDefaultDesign()
        );

        setConfigurations(defaultConfig);
        options?.onSuccess?.(defaultConfig);
        return defaultConfig;
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
