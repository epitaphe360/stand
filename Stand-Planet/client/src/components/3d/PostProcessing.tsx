import { EffectComposer, Bloom, SSAO, DepthOfField, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useStudioStore } from '@/store/useStudioStore';

/**
 * Système de post-processing photoréaliste
 * Effets: Bloom, SSAO, DOF, Chromatic Aberration, Vignette
 */

export interface PostProcessingSettings {
  enabled: boolean;
  bloom: {
    enabled: boolean;
    intensity: number;
    luminanceThreshold: number;
    luminanceSmoothing: number;
  };
  ssao: {
    enabled: boolean;
    intensity: number;
    radius: number;
    samples: number;
  };
  dof: {
    enabled: boolean;
    focusDistance: number;
    focalLength: number;
    bokehScale: number;
  };
  chromaticAberration: {
    enabled: boolean;
    offset: number;
  };
  vignette: {
    enabled: boolean;
    darkness: number;
    offset: number;
  };
}

export const DEFAULT_POSTPROCESSING_SETTINGS: PostProcessingSettings = {
  enabled: true,
  bloom: {
    enabled: true,
    intensity: 1.2,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.4,
  },
  ssao: {
    enabled: true,
    intensity: 1.5,
    radius: 0.5,
    samples: 16,
  },
  dof: {
    enabled: false,
    focusDistance: 0.5,
    focalLength: 0.05,
    bokehScale: 2,
  },
  chromaticAberration: {
    enabled: false,
    offset: 0.001,
  },
  vignette: {
    enabled: true,
    darkness: 0.5,
    offset: 0.5,
  },
};

export function PostProcessingEffects() {
  // Pour l'instant, utiliser les settings par défaut
  // Plus tard, on pourra les rendre configurables via le store
  const settings = DEFAULT_POSTPROCESSING_SETTINGS;

  if (!settings.enabled) {
    return null;
  }

  return (
    <EffectComposer>
      <>
        {/* Bloom - Lueur autour des lumières */}
        {settings.bloom.enabled ? (
          <Bloom
            intensity={settings.bloom.intensity}
            luminanceThreshold={settings.bloom.luminanceThreshold}
            luminanceSmoothing={settings.bloom.luminanceSmoothing}
            blendFunction={BlendFunction.SCREEN}
          />
        ) : null}

        {/* SSAO - Ambient Occlusion pour ombres douces */}
        {settings.ssao.enabled ? (
          <SSAO
            intensity={settings.ssao.intensity}
            radius={settings.ssao.radius}
            samples={settings.ssao.samples}
            blendFunction={BlendFunction.MULTIPLY}
          />
        ) : null}

        {/* Depth of Field - Profondeur de champ (optionnel) */}
        {settings.dof.enabled ? (
          <DepthOfField
            focusDistance={settings.dof.focusDistance}
            focalLength={settings.dof.focalLength}
            bokehScale={settings.dof.bokehScale}
          />
        ) : null}

        {/* Chromatic Aberration - Aberration chromatique subtile (optionnel) */}
        {settings.chromaticAberration.enabled ? (
          <ChromaticAberration
            offset={[settings.chromaticAberration.offset, settings.chromaticAberration.offset]}
            blendFunction={BlendFunction.NORMAL}
          />
        ) : null}

        {/* Vignette - Assombrissement des bords */}
        {settings.vignette.enabled ? (
          <Vignette
            darkness={settings.vignette.darkness}
            offset={settings.vignette.offset}
            blendFunction={BlendFunction.NORMAL}
          />
        ) : null}
      </>
    </EffectComposer>
  );
}

/**
 * Presets de rendu pour différentes situations
 */
export const RENDER_PRESETS = {
  draft: {
    name: 'Brouillon (Rapide)',
    enabled: false,
    bloom: { enabled: false, intensity: 0, luminanceThreshold: 1, luminanceSmoothing: 0 },
    ssao: { enabled: false, intensity: 0, radius: 0, samples: 0 },
    dof: { enabled: false, focusDistance: 0, focalLength: 0, bokehScale: 0 },
    chromaticAberration: { enabled: false, offset: 0 },
    vignette: { enabled: false, darkness: 0, offset: 0 },
  },
  balanced: {
    name: 'Équilibré',
    enabled: true,
    bloom: { enabled: true, intensity: 0.8, luminanceThreshold: 0.95, luminanceSmoothing: 0.3 },
    ssao: { enabled: true, intensity: 1.0, radius: 0.4, samples: 16 },
    dof: { enabled: false, focusDistance: 0, focalLength: 0, bokehScale: 0 },
    chromaticAberration: { enabled: false, offset: 0 },
    vignette: { enabled: true, darkness: 0.4, offset: 0.5 },
  },
  photorealistic: {
    name: 'Photoréaliste (Lent)',
    enabled: true,
    bloom: { enabled: true, intensity: 1.5, luminanceThreshold: 0.85, luminanceSmoothing: 0.5 },
    ssao: { enabled: true, intensity: 2.0, radius: 0.6, samples: 32 },
    dof: { enabled: true, focusDistance: 0.5, focalLength: 0.05, bokehScale: 3 },
    chromaticAberration: { enabled: true, offset: 0.002 },
    vignette: { enabled: true, darkness: 0.6, offset: 0.6 },
  },
  presentation: {
    name: 'Présentation',
    enabled: true,
    bloom: { enabled: true, intensity: 1.2, luminanceThreshold: 0.9, luminanceSmoothing: 0.4 },
    ssao: { enabled: true, intensity: 1.5, radius: 0.5, samples: 16 },
    dof: { enabled: false, focusDistance: 0, focalLength: 0, bokehScale: 0 },
    chromaticAberration: { enabled: false, offset: 0 },
    vignette: { enabled: true, darkness: 0.5, offset: 0.5 },
  },
} as const;

export type RenderPresetName = keyof typeof RENDER_PRESETS;
