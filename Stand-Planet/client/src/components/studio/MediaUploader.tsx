import { useState, useCallback, useRef } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, X, Check, AlertCircle } from 'lucide-react';

/**
 * Composant de gestion drag & drop pour médias (images, vidéos)
 * Permet d'assigner directement des médias aux écrans et murs
 */

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number; // Pour les vidéos
}

interface MediaUploaderProps {
  onMediaSelect?: (media: MediaFile) => void;
  acceptedTypes?: string[];
  maxSize?: number; // en MB
}

export function MediaUploader({
  onMediaSelect,
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 50, // 50 MB par défaut
}: MediaUploaderProps) {
  const [mediaLibrary, setMediaLibrary] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Gérer le drop de fichiers
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    []
  );

  /**
   * Gérer la sélection de fichiers via input
   */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const files = Array.from(e.target.files || []);
      processFiles(files);
    },
    []
  );

  /**
   * Traiter les fichiers uploadés
   */
  const processFiles = async (files: File[]) => {
    for (const file of files) {
      // Vérifier le type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setError(`${file.name}: Type de fichier non supporté`);
        continue;
      }

      // Vérifier la taille
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        setError(
          `${file.name}: Fichier trop volumineux (${sizeMB.toFixed(1)}MB > ${maxSize}MB)`
        );
        continue;
      }

      try {
        // Simuler l'upload (dans une vraie app, upload vers serveur)
        setUploadProgress(0);

        const mediaFile = await createMediaFile(file);

        setMediaLibrary((prev) => [...prev, mediaFile]);
        setUploadProgress(100);

        // Notifier la sélection
        if (onMediaSelect) {
          onMediaSelect(mediaFile);
        }

        // Reset progress après 1s
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (err) {
        setError(`Erreur lors du traitement de ${file.name}`);
        console.error(err);
      }
    }
  };

  /**
   * Créer un objet MediaFile à partir d'un File
   */
  const createMediaFile = async (file: File): Promise<MediaFile> => {
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');

    let thumbnail = url;
    let width: number | undefined;
    let height: number | undefined;
    let duration: number | undefined;

    if (isImage) {
      // Charger l'image pour obtenir les dimensions
      const img = await loadImage(url);
      width = img.width;
      height = img.height;
    } else {
      // Charger la vidéo pour obtenir les métadonnées
      const video = await loadVideo(url);
      width = video.videoWidth;
      height = video.videoHeight;
      duration = video.duration;

      // Générer une miniature depuis la vidéo
      thumbnail = await generateVideoThumbnail(video);
    }

    return {
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: isImage ? 'image' : 'video',
      url,
      thumbnail,
      size: file.size,
      width,
      height,
      duration,
    };
  };

  /**
   * Charger une image
   */
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  /**
   * Charger une vidéo
   */
  const loadVideo = (url: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve(video);
      video.onerror = reject;
      video.src = url;
    });
  };

  /**
   * Générer une miniature depuis une vidéo
   */
  const generateVideoThumbnail = async (
    video: HTMLVideoElement
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d')!;

      // Chercher à 1 seconde dans la vidéo
      video.currentTime = 1;

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  /**
   * Supprimer un média
   */
  const removeMedia = (id: string) => {
    setMediaLibrary((prev) => {
      const media = prev.find((m) => m.id === id);
      if (media) {
        URL.revokeObjectURL(media.url);
        if (media.thumbnail !== media.url) {
          URL.revokeObjectURL(media.thumbnail);
        }
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bibliothèque Média</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
        </div>

        {/* Zone de drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: 'pointer' }}
        >
          <Upload
            className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez des images ou vidéos ici
          </p>
          <p className="text-xs text-gray-500">
            ou cliquez pour parcourir (max {maxSize}MB)
          </p>

          {/* Progress bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Input caché */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Bibliothèque de médias */}
        {mediaLibrary.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Fichiers importés ({mediaLibrary.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mediaLibrary.map((media) => (
                <MediaThumbnail
                  key={media.id}
                  media={media}
                  onSelect={() => onMediaSelect?.(media)}
                  onRemove={() => removeMedia(media.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            💡 Comment utiliser
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • Glissez une image/vidéo directement sur un écran ou mur dans la
              vue 3D
            </li>
            <li>
              • Ou sélectionnez un module puis cliquez sur un média ici pour
              l'assigner
            </li>
            <li>• Les vidéos seront lues en boucle automatiquement</li>
            <li>• Résolution recommandée: 1920x1080 (Full HD)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

/**
 * Composant miniature de média
 */
function MediaThumbnail({
  media,
  onSelect,
  onRemove,
}: {
  media: MediaFile;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Miniature */}
      <img
        src={media.thumbnail}
        alt={media.name}
        className="w-full h-full object-cover"
      />

      {/* Icône type */}
      <div className="absolute top-2 left-2 bg-black/50 rounded px-2 py-1">
        {media.type === 'image' ? (
          <Image className="w-3 h-3 text-white" />
        ) : (
          <Video className="w-3 h-3 text-white" />
        )}
      </div>

      {/* Bouton supprimer */}
      {isHovered && (
        <button
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Info overlay */}
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
          <p className="text-xs font-medium truncate">{media.name}</p>
          <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
            <span>
              {media.width}x{media.height}
            </span>
            <span>{(media.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>
          {media.duration && (
            <span className="text-xs text-gray-300">
              {media.duration.toFixed(1)}s
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Hook pour drag & drop de médias sur des modules 3D
 */
export function useMediaDragDrop() {
  const { updateModule, selectedModuleId, placedModules } = useStudioStore();

  const handleMediaDrop = useCallback(
    (media: MediaFile, moduleId: string) => {
      const module = placedModules.find((m) => m.instanceId === moduleId);

      if (!module) return;

      // Vérifier si le module peut accepter des médias
      const canAcceptMedia =
        module.category === 'multimedia' ||
        module.category === 'wall' ||
        module.id.startsWith('multi-');

      if (!canAcceptMedia) {
        console.warn(
          `Le module ${module.name} ne peut pas afficher de médias`
        );
        return;
      }

      // Mettre à jour le module avec l'URL du média
      updateModule(moduleId, {
        ...module,
        // Stocker l'URL du média dans une propriété custom
        material: {
          ...module.material,
          value: media.url,
          type: media.type === 'image' ? 'texture' : 'video',
        },
      } as any);

      console.log(`Média "${media.name}" assigné à "${module.name}"`);
    },
    [placedModules, updateModule]
  );

  return { handleMediaDrop };
}
