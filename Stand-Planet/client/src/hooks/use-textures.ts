import { useState, useCallback, useEffect } from 'react';
import { loadAssetTexture, loadPBRTextures, PBRTextureMaps } from '@/lib/3d/texture-loader';
import * as THREE from 'three';

/**
 * Hook pour gérer les textures sur un module
 */
export function useModuleTexture(moduleInstanceId: string, assetUrl?: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTexture = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const loadedTexture = await loadAssetTexture(url, {
        repeat: { x: 1, y: 1 },
        anisotropy: 16,
      });
      setTexture(loadedTexture);
    } catch (err: any) {
      console.error('Erreur chargement texture:', err);
      setError(err.message || 'Erreur lors du chargement de la texture');
      setTexture(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger la texture quand l'URL change
  useEffect(() => {
    if (assetUrl) {
      loadTexture(assetUrl);
    } else {
      setTexture(null);
    }

    // Cleanup
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [assetUrl]);

  return { texture, loading, error, reload: () => assetUrl && loadTexture(assetUrl) };
}

/**
 * Hook pour gérer les textures PBR complètes
 */
export function usePBRTextures(basePath?: string, maps?: {
  albedo?: string;
  normal?: string;
  roughness?: string;
  metalness?: string;
  ao?: string;
  displacement?: string;
}) {
  const [textures, setTextures] = useState<PBRTextureMaps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!basePath || !maps) {
      setTextures(null);
      return;
    }

    setLoading(true);
    setError(null);

    loadPBRTextures(basePath, maps)
      .then((loadedTextures) => {
        setTextures(loadedTextures);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement textures PBR:', err);
        setError(err.message || 'Erreur lors du chargement des textures PBR');
        setTextures(null);
        setLoading(false);
      });

    // Cleanup
    return () => {
      if (textures) {
        Object.values(textures).forEach((tex) => tex?.dispose());
      }
    };
  }, [basePath, maps]);

  return { textures, loading, error };
}

/**
 * Hook pour gérer les assets d'un module (logos, images appliqués)
 */
export function useModuleAssets(moduleInstanceId: string, boothId: number) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/booths/${boothId}/modules/${moduleInstanceId}/assets`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error('Erreur chargement assets module:', err);
    } finally {
      setLoading(false);
    }
  }, [moduleInstanceId, boothId]);

  const applyAsset = useCallback(async (assetId: number, face: string = 'front') => {
    try {
      const response = await fetch(`/api/booths/${boothId}/modules/${moduleInstanceId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, face }),
      });

      if (response.ok) {
        await fetchAssets(); // Recharger la liste
        return true;
      }
    } catch (err) {
      console.error('Erreur application asset:', err);
    }
    return false;
  }, [moduleInstanceId, boothId, fetchAssets]);

  const removeAsset = useCallback(async (moduleAssetId: number) => {
    try {
      const response = await fetch(
        `/api/booths/${boothId}/modules/${moduleInstanceId}/assets/${moduleAssetId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchAssets();
        return true;
      }
    } catch (err) {
      console.error('Erreur suppression asset:', err);
    }
    return false;
  }, [moduleInstanceId, boothId, fetchAssets]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    loading,
    applyAsset,
    removeAsset,
    refresh: fetchAssets,
  };
}
