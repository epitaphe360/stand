import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, FileText, Video, Loader2, Check } from "lucide-react";

interface Asset {
  id: number;
  type: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

interface AssetUploaderProps {
  onAssetSelect?: (asset: Asset) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export default function AssetUploader({
  onAssetSelect,
  acceptedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
  maxSizeMB = 10
}: AssetUploaderProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les assets existants
  const loadAssets = useCallback(async () => {
    try {
      const response = await fetch("/api/assets");
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des assets:", err);
    }
  }, []);

  // Upload d'un fichier
  const uploadFile = async (file: File) => {
    // Vérifications
    if (!acceptedTypes.includes(file.type)) {
      setError(`Type de fichier non accepté: ${file.type}`);
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`Fichier trop volumineux. Max: ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", file.type.startsWith("image/") ? "logo" : "image");

      const xhr = new XMLHttpRequest();

      // Progression
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Promesse pour await
      const uploadPromise = new Promise<Asset>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 201) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.asset);
          } else {
            reject(new Error(`Erreur ${xhr.status}: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Erreur réseau lors de l'upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload annulé"));
        });
      });

      xhr.open("POST", "/api/assets/upload");
      xhr.send(formData);

      const newAsset = await uploadPromise;
      setAssets(prev => [newAsset, ...prev]);
      setUploadProgress(100);

      // Notification de succès
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (err: any) {
      console.error("Erreur upload:", err);
      setError(err.message || "Erreur lors de l'upload");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Gestion du drag & drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Sélection via input file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  // Supprimer un asset
  const deleteAsset = async (assetId: number) => {
    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAssets(prev => prev.filter(a => a.id !== assetId));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  // Icône selon le type
  const getAssetIcon = (asset: Asset) => {
    if (asset.type === "video") return <Video className="w-6 h-6 text-purple-500" />;
    if (asset.type === "document") return <FileText className="w-6 h-6 text-red-500" />;
    return <ImageIcon className="w-6 h-6 text-blue-500" />;
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Bibliothèque d'Assets
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Logos, images et textures pour le branding
        </p>
      </div>

      {/* Zone d'upload */}
      <div className="p-4 bg-gray-800/50">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
            ${isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
            }
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(",")}
            onChange={handleFileSelect}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-sm">Upload en cours... {uploadProgress}%</p>
              <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-300">
                Glissez-déposez un fichier ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500">
                Max {maxSizeMB}MB • JPG, PNG, SVG, WebP
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500 rounded text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Liste des assets */}
      <div className="flex-1 overflow-y-auto p-4">
        {assets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>Aucun asset uploadé</p>
            <p className="text-sm mt-1">Uploadez votre premier logo ou image</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => onAssetSelect?.(asset)}
              >
                {/* Preview */}
                <div className="aspect-square bg-gray-900 flex items-center justify-center">
                  {asset.thumbnailUrl || asset.type === "image" || asset.type === "logo" ? (
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getAssetIcon(asset)
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(asset.fileSize)}</p>
                  {asset.width && asset.height && (
                    <p className="text-xs text-gray-600">{asset.width}×{asset.height}</p>
                  )}
                </div>

                {/* Bouton supprimer */}
                <button
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAsset(asset.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Indicateur de sélection */}
                <div className="absolute bottom-2 right-2 p-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
