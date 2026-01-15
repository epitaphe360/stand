// Composant Assistant IA pour le Stand Studio
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Sparkles, X, Lightbulb } from 'lucide-react';
import { generateDesignFromPrompt, quickSuggestions } from '@/lib/ai/designGenerator';
import { useStudioStore } from '@/store/useStudioStore';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose?: () => void;
}

export default function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Bonjour ! Je suis votre assistant IA pour la création de stands. Décrivez-moi votre vision et je générerai un design personnalisé pour vous.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loadConfiguration, toggleAIAssistant } = useStudioStore();

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // Note: En production, l'API key devrait être stockée de manière sécurisée
      const apiKey = localStorage.getItem('openai_api_key') || '';
      
      if (!apiKey) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Clé API OpenAI non configurée. Pour l\'instant, voici un exemple de stand basé sur votre demande...\n\nJe vais créer un design moderne pour vous.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Générer un design par défaut sans appel API
        await generateMockDesign(input);
        setIsGenerating(false);
        return;
      }

      const configurations = await generateDesignFromPrompt(
        { prompt: input },
        apiKey
      );

      if (configurations.length > 0) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `✨ J'ai généré ${configurations.length} proposition(s) pour vous ! Le design "${configurations[0].name}" a été chargé dans le canvas. ${configurations[0].description}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Charger la première configuration
        loadConfiguration(configurations[0]);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur:', error);
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Désolé, une erreur s\'est produite lors de la génération. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockDesign = async (prompt: string) => {
    // Simulation d'une génération pour la démo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Importer quelques modules pour créer un stand de démonstration
    const { getModuleById } = await import('@/lib/3d/modules');
    
    const baseModules = [
      { id: 'wall-001', pos: { x: 0, y: 1.25, z: -1.45 } },
      { id: 'furn-001', pos: { x: -1.5, y: 0.55, z: 0 } },
      { id: 'furn-002', pos: { x: 1.5, y: 1, z: 0 } },
      { id: 'light-001', pos: { x: 0, y: 2.5, z: 0 } }
    ];
    
    const placedModules = baseModules
      .map(({ id, pos }) => {
        const module = getModuleById(id);
        if (!module) return null;
        
        return {
          ...module,
          instanceId: `${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: pos,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          material: module.defaultMaterial,
          isSelected: false,
          isLocked: false
        };
      })
      .filter(Boolean) as any[];
    
    const mockConfig = {
      name: 'Stand Moderne - Démo',
      description: 'Configuration de démonstration générée selon votre demande',
      dimensions: { width: 6, depth: 3 },
      modules: placedModules,
      backgroundColor: '#f5f5f5',
      floorMaterial: { type: 'color' as const, value: '#e8e8e8' },
      style: 'modern' as const,
      totalPrice: placedModules.reduce((sum, m) => sum + (m?.price || 0), 0)
    };
    
    loadConfiguration(mockConfig);
    
    // Message de confirmation
    const confirmMessage: Message = {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: `✨ Design de démonstration créé ! J'ai ajouté ${placedModules.length} modules pour vous. Prix total : ${mockConfig.totalPrice}€\n\n💡 Pour activer l'IA complète, configurez votre clé API OpenAI dans les paramètres.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleQuickSuggestion = (key: keyof typeof quickSuggestions) => {
    const suggestion = quickSuggestions[key];
    setInput(suggestion.prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistant IA</h3>
            <p className="text-xs text-gray-500">Créez votre stand parfait</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose || toggleAIAssistant}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-1 mb-2">
          <Lightbulb className="w-3 h-3 text-yellow-600" />
          <span className="text-xs font-medium text-gray-700">Suggestions rapides</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-purple-50 text-xs py-0.5"
            onClick={() => handleQuickSuggestion('tech-moderne')}
          >
            Tech Moderne
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-purple-50 text-xs py-0.5"
            onClick={() => handleQuickSuggestion('luxe')}
          >
            Luxe
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-purple-50 text-xs py-0.5"
            onClick={() => handleQuickSuggestion('eco')}
          >
            Écologique
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-purple-50 text-xs py-0.5"
            onClick={() => handleQuickSuggestion('interactif')}
          >
            Interactif
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération en cours...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white sticky bottom-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Décrivez votre stand idéal..."
            disabled={isGenerating}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée pour envoyer
        </p>
      </div>
    </Card>
  );
}
