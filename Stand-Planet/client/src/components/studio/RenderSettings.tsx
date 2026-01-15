import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RENDER_PRESETS, RenderPresetName, PostProcessingSettings } from '@/components/3d/PostProcessing';
import { ENVIRONMENT_PRESETS } from '@/lib/3d/environment';
import { Sun, Sparkles, Camera, Settings } from 'lucide-react';

/**
 * Panneau de configuration du rendu et de l'environnement
 */

export function RenderSettings() {
  const [renderPreset, setRenderPreset] = useState<RenderPresetName>('balanced');
  const [environmentPreset, setEnvironmentPreset] = useState('studio');
  const [postProcessing, setPostProcessing] = useState<PostProcessingSettings>(RENDER_PRESETS.balanced);

  const handlePresetChange = (presetName: RenderPresetName) => {
    setRenderPreset(presetName);
    setPostProcessing(RENDER_PRESETS[presetName]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Paramètres de Rendu
        </CardTitle>
        <CardDescription>
          Contrôlez la qualité visuelle et l'environnement de votre stand
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="environment">Environnement</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Presets de rendu */}
          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-2">
              <Label>Preset de Qualité</Label>
              <Select value={renderPreset} onValueChange={(value) => handlePresetChange(value as RenderPresetName)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RENDER_PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="bloom-toggle" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Bloom
                </Label>
                <Switch
                  id="bloom-toggle"
                  checked={postProcessing.bloom.enabled}
                  onCheckedChange={(checked) =>
                    setPostProcessing({
                      ...postProcessing,
                      bloom: { ...postProcessing.bloom, enabled: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="ssao-toggle">SSAO</Label>
                <Switch
                  id="ssao-toggle"
                  checked={postProcessing.ssao.enabled}
                  onCheckedChange={(checked) =>
                    setPostProcessing({
                      ...postProcessing,
                      ssao: { ...postProcessing.ssao, enabled: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dof-toggle">Depth of Field</Label>
                <Switch
                  id="dof-toggle"
                  checked={postProcessing.dof.enabled}
                  onCheckedChange={(checked) =>
                    setPostProcessing({
                      ...postProcessing,
                      dof: { ...postProcessing.dof, enabled: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="vignette-toggle">Vignette</Label>
                <Switch
                  id="vignette-toggle"
                  checked={postProcessing.vignette.enabled}
                  onCheckedChange={(checked) =>
                    setPostProcessing({
                      ...postProcessing,
                      vignette: { ...postProcessing.vignette, enabled: checked },
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Environnement et éclairage */}
          <TabsContent value="environment" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Preset d'Environnement
              </Label>
              <Select value={environmentPreset} onValueChange={setEnvironmentPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ENVIRONMENT_PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {ENVIRONMENT_PRESETS[environmentPreset]?.description}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Intensité Ambiante</Label>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  value={[ENVIRONMENT_PRESETS[environmentPreset]?.ambientIntensity || 0.5]}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          {/* Paramètres avancés */}
          <TabsContent value="advanced" className="space-y-4">
            {postProcessing.bloom.enabled && (
              <div className="space-y-2">
                <Label>Bloom Intensity</Label>
                <Slider
                  min={0}
                  max={3}
                  step={0.1}
                  value={[postProcessing.bloom.intensity]}
                  onValueChange={(value) =>
                    setPostProcessing({
                      ...postProcessing,
                      bloom: { ...postProcessing.bloom, intensity: value[0] },
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">{postProcessing.bloom.intensity.toFixed(1)}</span>
              </div>
            )}

            {postProcessing.ssao.enabled && (
              <div className="space-y-2">
                <Label>SSAO Intensity</Label>
                <Slider
                  min={0}
                  max={3}
                  step={0.1}
                  value={[postProcessing.ssao.intensity]}
                  onValueChange={(value) =>
                    setPostProcessing({
                      ...postProcessing,
                      ssao: { ...postProcessing.ssao, intensity: value[0] },
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">{postProcessing.ssao.intensity.toFixed(1)}</span>
              </div>
            )}

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handlePresetChange('balanced')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Réinitialiser aux valeurs par défaut
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
