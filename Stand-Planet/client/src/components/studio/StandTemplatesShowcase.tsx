import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { standTemplates } from '@/lib/3d/standTemplates';
import { Link } from 'wouter';

export function StandTemplatesShowcase() {
  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      tech: 'bg-blue-500',
      luxury: 'bg-purple-500',
      industry: 'bg-orange-500',
      services: 'bg-green-500',
      universal: 'bg-gray-500'
    };
    return colors[sector] || 'bg-gray-500';
  };

  const getSectorLabel = (sector: string) => {
    const labels: Record<string, string> = {
      tech: 'Tech & Innovation',
      luxury: 'Luxe & Premium',
      industry: 'Industrie & Produits',
      services: 'Services & Entreprises',
      universal: 'Universal'
    };
    return labels[sector] || sector;
  };

  const getSectorIcon = (sector: string) => {
    const icons: Record<string, string> = {
      tech: '💻',
      luxury: '✨',
      industry: '🏭',
      services: '💼',
      universal: '🎪'
    };
    return icons[sector] || '📦';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🏢 Stands Professionnel Pré-configurés</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez parmi nos 5 templates clés en main, inspirés des standards professionnels d'Epitaphe 360.
            Chaque stand est optimisé pour un secteur d'activité spécifique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {standTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-2xl transition-all overflow-hidden group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getSectorIcon(template.sector)}</span>
                      <Badge className={`${getSectorColor(template.sector)} text-white`}>
                        {getSectorLabel(template.sector)}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{template.name}</CardTitle>
                    <CardDescription className="text-base mt-2">{template.description}</CardDescription>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-bold text-blue-600">{template.surface}m²</p>
                    <p className="text-sm text-muted-foreground">Surface</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y">
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">{template.modules.length}</p>
                    <p className="text-xs text-muted-foreground">Modules</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-orange-600">{template.price}€</p>
                    <p className="text-xs text-muted-foreground">Montage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600">{template.dimensions.width}x{template.dimensions.depth}m</p>
                    <p className="text-xs text-muted-foreground">Dimensions</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Caractéristiques principales :</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {template.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-green-600 flex-shrink-0">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {template.features.length > 4 && (
                    <p className="text-xs text-blue-600 font-semibold">
                      +{template.features.length - 4} caractéristiques supplémentaires
                    </p>
                  )}
                </div>

                {/* Modules list */}
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-muted-foreground">Types de modules inclus :</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(template.modules.map(m => {
                      const moduleId = m.moduleId;
                      if (moduleId.startsWith('furn')) return '🪑 Mobilier';
                      if (moduleId.startsWith('wall')) return '🧱 Murs';
                      if (moduleId.startsWith('light')) return '💡 Éclairage';
                      if (moduleId.startsWith('multi')) return '📺 Multimédia';
                      if (moduleId.startsWith('plv')) return '📢 PLV';
                      if (moduleId.startsWith('deco')) return '🎨 Décoration';
                      return '📦 Autre';
                    }))).map((type, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Link href={`/exhibitor/1`}>
                  <a>
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      📋 Charger ce Stand et Personnaliser
                    </Button>
                  </a>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-950 rounded-lg p-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-4">✨ Avantages des Templates</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="flex gap-3">
              <span className="text-2xl flex-shrink-0">⚡</span>
              <div>
                <p className="font-semibold">Gain de temps</p>
                <p className="text-sm text-muted-foreground">Commencez directement avec une configuration professionnelle éprouvée</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-2xl flex-shrink-0">💰</span>
              <div>
                <p className="font-semibold">Tarifs optimisés</p>
                <p className="text-sm text-muted-foreground">Prix forfaitaires compétitifs pour la montage et personnalisation</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-2xl flex-shrink-0">🎯</span>
              <div>
                <p className="font-semibold">Secteur adapté</p>
                <p className="text-sm text-muted-foreground">Chaque template est optimisé pour votre domaine d'activité</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
