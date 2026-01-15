// Page d'accueil du Stand Studio
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, PlusCircle, FileText, Play, ArrowRight } from 'lucide-react';
import StandStudio from '@/components/studio/StandStudio';
import TemplateGallery from '@/components/studio/TemplateGallery';
import { useStudioStore } from '@/store/useStudioStore';

export default function StudioHome() {
  const [mode, setMode] = useState<'welcome' | 'templates' | 'studio'>('welcome');
  const { resetConfiguration, toggleAIAssistant } = useStudioStore();

  if (mode === 'studio') {
    return <StandStudio />;
  }

  if (mode === 'templates') {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b p-4">
          <Button variant="ghost" onClick={() => setMode('welcome')}>
            ← Retour
          </Button>
        </div>
        <TemplateGallery />
        <div className="bg-white border-t p-4 flex justify-center">
          <Button
            size="lg"
            onClick={() => setMode('studio')}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Ouvrir le Studio
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const handleStartFromScratch = () => {
    resetConfiguration();
    setMode('studio');
  };

  const handleStartWithAI = () => {
    resetConfiguration();
    setMode('studio');
    setTimeout(() => toggleAIAssistant(), 100);
  };

  const handleStartWithTemplate = () => {
    setMode('templates');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Propulsé par l'Intelligence Artificielle
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Stand Studio
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Créez des stands d'exposition professionnels en quelques minutes
            avec notre outil de conception 3D assisté par IA
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={handleStartWithAI}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Créer avec l'IA
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleStartFromScratch}
              className="text-lg px-8 py-6 h-auto"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Partir de zéro
            </Button>
          </div>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <Card
            className="p-6 hover:shadow-xl transition-all cursor-pointer group"
            onClick={handleStartWithAI}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Assistant IA</h3>
            <p className="text-gray-600 mb-4">
              Décrivez votre vision et laissez l'IA générer un design personnalisé
              en quelques secondes.
            </p>
            <div className="flex items-center text-purple-600 font-medium group-hover:gap-2 transition-all">
              Commencer
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-xl transition-all cursor-pointer group"
            onClick={handleStartWithTemplate}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Templates Pro</h3>
            <p className="text-gray-600 mb-4">
              Choisissez parmi une collection de templates professionnels
              adaptés à votre secteur.
            </p>
            <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              Explorer
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-xl transition-all cursor-pointer group"
            onClick={handleStartFromScratch}
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mode Libre</h3>
            <p className="text-gray-600 mb-4">
              Créez de A à Z avec notre interface drag & drop intuitive
              et nos modules prédéfinis.
            </p>
            <div className="flex items-center text-indigo-600 font-medium group-hover:gap-2 transition-all">
              Créer
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités Clés
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                ✨
              </div>
              <div>
                <h3 className="font-semibold mb-1">Génération IA</h3>
                <p className="text-gray-600 text-sm">
                  L'IA comprend vos besoins et génère des designs optimisés automatiquement
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                🎨
              </div>
              <div>
                <h3 className="font-semibold mb-1">Bibliothèque de Modules</h3>
                <p className="text-gray-600 text-sm">
                  Plus de 50 modules prédéfinis : murs, mobilier, éclairage, multimédia...
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                🖱️
              </div>
              <div>
                <h3 className="font-semibold mb-1">Drag & Drop</h3>
                <p className="text-gray-600 text-sm">
                  Interface intuitive avec placement, rotation et personnalisation en temps réel
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                📸
              </div>
              <div>
                <h3 className="font-semibold mb-1">Rendu Réaliste</h3>
                <p className="text-gray-600 text-sm">
                  Visualisation 3D photoréaliste avec éclairage et matériaux avancés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
