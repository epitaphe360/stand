import React, { useState } from 'react';
import { useBrandingStore } from '@/store/useBrandingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export const BrandingPanel = () => {
  const branding = useBrandingStore();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(branding.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setLogoPreview(url);
        branding.setLogoUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const config = branding.exportBrandingConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-config.json';
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        branding.importBrandingConfig(json);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            🎨 Configuration Branding
          </CardTitle>
          <CardDescription>
            Personnalisez l'identité visuelle de votre stand
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="identity">Identité</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="materials">Matériaux</TabsTrigger>
              <TabsTrigger value="effects">Effets</TabsTrigger>
            </TabsList>

            {/* IDENTITY TAB */}
            <TabsContent value="identity" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-base font-semibold">
                    Nom de l'Entreprise
                  </Label>
                  <Input
                    id="company-name"
                    value={branding.companyName}
                    onChange={(e) => branding.setCompanyName(e.target.value)}
                    placeholder="Votre entreprise"
                    className="text-lg"
                  />
                </div>

                {/* Logo Scale */}
                <div className="space-y-2">
                  <Label htmlFor="logo-scale" className="text-base font-semibold">
                    Échelle du Logo: {branding.logoScale.toFixed(1)}x
                  </Label>
                  <Slider
                    id="logo-scale"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={[branding.logoScale]}
                    onValueChange={(v) => branding.setLogoScale(v[0])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-3 border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-white">
                <div className="text-3xl mb-2">📸</div>
                <Label htmlFor="logo-upload" className="text-sm font-medium text-gray-700">
                  Upload du Logo
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  variant="outline"
                  className="w-full"
                >
                  Sélectionner une image
                </Button>
                {logoPreview && (
                  <div className="mt-4">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="h-24 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Text Custom */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headline" className="text-base font-semibold">
                    Titre Principal
                  </Label>
                  <Input
                    id="headline"
                    value={branding.textCustom.headline}
                    onChange={(e) => branding.setHeadline(e.target.value)}
                    placeholder="Ex: Bienvenue sur notre Stand"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-base font-semibold">
                    Sous-titre
                  </Label>
                  <Input
                    id="tagline"
                    value={branding.textCustom.tagline}
                    onChange={(e) => branding.setTagline(e.target.value)}
                    placeholder="Ex: Innovation et Excellence"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="custom-text" className="text-base font-semibold">
                    Texte Additionnel
                  </Label>
                  <Input
                    id="custom-text"
                    value={branding.textCustom.customText}
                    onChange={(e) => branding.setCustomText(e.target.value)}
                    placeholder="Texte personnalisé"
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* COLORS TAB */}
            <TabsContent value="colors" className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Primary Color */}
                <div className="space-y-3">
                  <Label htmlFor="primary-color" className="text-base font-semibold">
                    Couleur Primaire
                  </Label>
                  <div className="flex gap-2">
                    <input
                      id="primary-color"
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => branding.setPrimaryColor(e.target.value)}
                      className="w-16 h-10 rounded cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => branding.setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div 
                    className="w-full h-12 rounded-lg shadow-md border border-gray-300"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                </div>

                {/* Secondary Color */}
                <div className="space-y-3">
                  <Label htmlFor="secondary-color" className="text-base font-semibold">
                    Couleur Secondaire
                  </Label>
                  <div className="flex gap-2">
                    <input
                      id="secondary-color"
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => branding.setSecondaryColor(e.target.value)}
                      className="w-16 h-10 rounded cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) => branding.setSecondaryColor(e.target.value)}
                        placeholder="#000000"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div 
                    className="w-full h-12 rounded-lg shadow-md border border-gray-300"
                    style={{ backgroundColor: branding.secondaryColor }}
                  />
                </div>

                {/* Accent Color */}
                <div className="space-y-3">
                  <Label htmlFor="accent-color" className="text-base font-semibold">
                    Couleur d'Accent
                  </Label>
                  <div className="flex gap-2">
                    <input
                      id="accent-color"
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => branding.setAccentColor(e.target.value)}
                      className="w-16 h-10 rounded cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                      <Input
                        value={branding.accentColor}
                        onChange={(e) => branding.setAccentColor(e.target.value)}
                        placeholder="#000000"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div 
                    className="w-full h-12 rounded-lg shadow-md border border-gray-300"
                    style={{ backgroundColor: branding.accentColor }}
                  />
                </div>
              </div>

              {/* Palette Preview */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm font-semibold mb-3 text-gray-700">Aperçu de la Palette</p>
                <div className="flex gap-2 h-16">
                  <div 
                    className="flex-1 rounded-lg shadow-md"
                    style={{ backgroundColor: branding.primaryColor }}
                    title="Primaire"
                  />
                  <div 
                    className="flex-1 rounded-lg shadow-md"
                    style={{ backgroundColor: branding.secondaryColor }}
                    title="Secondaire"
                  />
                  <div 
                    className="flex-1 rounded-lg shadow-md"
                    style={{ backgroundColor: branding.accentColor }}
                    title="Accent"
                  />
                </div>
              </div>
            </TabsContent>

            {/* MATERIALS TAB */}
            <TabsContent value="materials" className="space-y-6">
              {/* Wall Material */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Matériau des Murs</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['white', 'black', 'custom'].map((material) => (
                    <Button
                      key={material}
                      variant={branding.materials.wallMaterial === material ? 'default' : 'outline'}
                      onClick={() => branding.setWallMaterial(material as 'white' | 'black' | 'custom')}
                      className="text-sm"
                    >
                      {material === 'white' ? '⚪ Blanc' : material === 'black' ? '⚫ Noir' : '🎨 Personnalisé'}
                    </Button>
                  ))}
                </div>
                {branding.materials.wallMaterial === 'custom' && (
                  <div className="mt-3 p-3 bg-white rounded-lg border">
                    <Label htmlFor="wall-color" className="text-sm">Couleur du Mur</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        id="wall-color"
                        type="color"
                        value={branding.materials.wallColor}
                        onChange={(e) => branding.setWallColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={branding.materials.wallColor}
                        onChange={(e) => branding.setWallColor(e.target.value)}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Floor Material */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Matériau du Sol</Label>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {['marble', 'polished', 'wood', 'concrete', 'carpet'].map((material) => (
                    <Button
                      key={material}
                      size="sm"
                      variant={branding.materials.floorMaterial === material ? 'default' : 'outline'}
                      onClick={() => branding.setFloorMaterial(material as any)}
                    >
                      {material === 'marble' && '🪨 Marbre'}
                      {material === 'polished' && '✨ Poli'}
                      {material === 'wood' && '🌳 Bois'}
                      {material === 'concrete' && '🏗️ Béton'}
                      {material === 'carpet' && '🟦 Moquette'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Floor Color */}
              <div className="space-y-3">
                <Label htmlFor="floor-color" className="text-base font-semibold">Couleur du Sol</Label>
                <div className="flex gap-2">
                  <input
                    id="floor-color"
                    type="color"
                    value={branding.materials.floorColor}
                    onChange={(e) => branding.setFloorColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={branding.materials.floorColor}
                    onChange={(e) => branding.setFloorColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* EFFECTS TAB */}
            <TabsContent value="effects" className="space-y-6">
              {/* Ambient Light */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Intensité Lumineuse</Label>
                  <span className="text-sm bg-purple-100 px-3 py-1 rounded-full">
                    {branding.effects.ambientIntensity.toFixed(2)}
                  </span>
                </div>
                <Slider
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={[branding.effects.ambientIntensity]}
                  onValueChange={(v) => branding.setAmbientIntensity(v[0])}
                  className="w-full"
                />
              </div>

              {/* Spotlights */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                <div>
                  <p className="font-semibold text-base">💡 Projecteurs Orientables</p>
                  <p className="text-sm text-gray-600">Éclairage d'accent sur les produits</p>
                </div>
                <Switch
                  checked={branding.effects.enableSpotlights}
                  onCheckedChange={(checked) => branding.setEnableSpotlights(checked)}
                />
              </div>

              {/* Glow Effect */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                <div>
                  <p className="font-semibold text-base">✨ Effet de Luminescence</p>
                  <p className="text-sm text-gray-600">Glow subtil sur les bords</p>
                </div>
                <Switch
                  checked={branding.effects.enableGlowEffect}
                  onCheckedChange={(checked) => branding.setEnableGlowEffect(checked)}
                />
              </div>

              {/* Fog */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                <div>
                  <p className="font-semibold text-base">🌫️ Brume Atmosphérique</p>
                  <p className="text-sm text-gray-600">Profondeur et ambiance</p>
                </div>
                <Switch
                  checked={branding.effects.enableFog}
                  onCheckedChange={(checked) => branding.setEnableFog(checked)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-300">
            <Button 
              onClick={() => branding.resetBranding()}
              variant="outline"
              className="flex-1"
            >
              🔄 Réinitialiser
            </Button>
            <Button 
              onClick={handleExport}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              📥 Exporter Config
            </Button>
            <Button 
              onClick={() => document.getElementById('branding-import')?.click()}
              variant="outline"
              className="flex-1"
            >
              📤 Importer Config
            </Button>
            <input
              id="branding-import"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
