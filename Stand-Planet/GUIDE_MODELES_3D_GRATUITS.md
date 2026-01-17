# 🎨 Guide de Téléchargement des Modèles 3D Gratuits

**Objectif**: Compléter les 50 modèles GLTF manquants avec des ressources **100% gratuites**

**Budget**: 0€ 🎉
**Délai estimé**: 1-3 jours (selon vitesse de téléchargement/conversion)

---

## 📚 Meilleures Plateformes Gratuites

### 1. **Sketchfab** ⭐ RECOMMANDÉ
**Pourquoi c'est le meilleur**: Format GLTF natif, qualité professionnelle, vaste bibliothèque

**Comment télécharger**:
```
1. Aller sur https://sketchfab.com
2. Rechercher les termes:
   - "exhibition stand"
   - "trade show booth"
   - "display stand"
   - "furniture office" (pour mobilier)
   - "modern chair" (pour chaises)
   - "desk" (pour bureaux)
   - "plant pot" (pour plantes)
   - "LED screen" (pour écrans)

3. Activer les filtres:
   ✅ Downloadable (Téléchargeable)
   ✅ Free (Gratuit)
   ✅ Animated (optionnel, pour animations)

4. Télécharger au format:
   → "glTF" ou "glTF Binary (.glb)" ⭐ Préféré
```

**Liens directs utiles**:
- https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b&q=exhibition+stand&sort_by=-likeCount&type=models
- https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b&q=office+furniture&type=models
- https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b&q=modern+chair&type=models

**Licences courantes** (vérifier avant utilisation):
- ✅ **CC0 (Public Domain)**: Utilisation libre totale
- ✅ **CC BY**: Attribution requise (créditer l'auteur)
- ⚠️ **CC BY-SA**: Attribution + partage identique
- ❌ **CC BY-NC**: Non commercial (éviter pour produit commercial)

---

### 2. **CGTrader**
**Lien**: https://www.cgtrader.com/free-3d-models

**Comment télécharger**:
```
1. Rechercher "exhibition stand" ou "booth"
2. Activer filtre "Free 3D models"
3. Vérifier disponibilité format GLTF/GLB
4. Télécharger
```

**Lien direct**: https://www.cgtrader.com/free-3d-models/exhibition-stall

⚠️ **Note**: Souvent en OBJ/FBX → nécessite conversion

---

### 3. **3DExport**
**Lien**: https://3dexport.com/free-3d-models

**Recherches recommandées**:
- "exhibition stand"
- "trade show"
- "display booth"

**Formats disponibles**: OBJ, FBX (conversion requise)

---

### 4. **TurboSquid** (Section gratuite)
**Lien**: https://www.turbosquid.com

**Comment filtrer**:
```
1. Rechercher "exhibition stand"
2. Prix: $0 - $0 (gratuit uniquement)
3. Format: OBJ, FBX, glTF (si dispo)
```

---

### 5. **Poly Haven** (Haute qualité)
**Lien**: https://polyhaven.com/models

**Spécialité**: Props, mobilier, objets
**Licence**: CC0 (domaine public)
**Format**: Souvent GLB disponible

---

### 6. **Free3D**
**Lien**: https://free3d.com

**Catégories utiles**:
- Furniture
- Electronics
- Plants
- Decoration

---

### 7. **Mixamo** (Adobe - Gratuit)
**Lien**: https://www.mixamo.com

**Spécialité**: Personnages 3D animés (pour stands avec avatars)
**Format**: FBX → conversion GLTF nécessaire

---

## 🔄 Conversion de Formats

### Si le modèle n'est pas en GLTF/GLB:

#### **Option A: Outil en ligne** (Rapide, sans installation)

**Aspose 3D Converter** (Recommandé)
- https://products.aspose.app/3d/conversion/obj-to-gltf
- Formats: OBJ → GLTF, FBX → GLTF, STL → GLTF
- Limite: 10 fichiers/jour (gratuit)

**Steps**:
```
1. Upload fichier .obj ou .fbx
2. Sélectionner format de sortie: "glTF" ou "glTF Binary (.glb)"
3. Télécharger le résultat
```

---

#### **Option B: Blender** (Gratuit, puissant, offline)

**Installation**:
```bash
# Linux
sudo apt install blender

# macOS
brew install --cask blender

# Windows
https://www.blender.org/download/
```

**Conversion OBJ/FBX → GLB**:
```
1. Ouvrir Blender
2. File → Import → Wavefront (.obj) ou FBX (.fbx)
3. Sélectionner le fichier
4. File → Export → glTF 2.0 (.gltf/.glb)
5. Options recommandées:
   ✅ Format: glTF Binary (.glb)
   ✅ Include: Selected Objects
   ✅ Transform: +Y Up
   ✅ Geometry: Apply Modifiers
   ✅ Compression: Draco (optionnel, réduit taille)
6. Export
```

**Script Blender automatisé** (batch conversion):
```python
# convert_to_glb.py
import bpy
import os
import sys

# Usage: blender --background --python convert_to_glb.py -- input.fbx output.glb

argv = sys.argv
argv = argv[argv.index("--") + 1:]  # Get args after --
input_file = argv[0]
output_file = argv[1]

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import
if input_file.endswith('.fbx'):
    bpy.ops.import_scene.fbx(filepath=input_file)
elif input_file.endswith('.obj'):
    bpy.ops.import_scene.obj(filepath=input_file)

# Export GLB
bpy.ops.export_scene.gltf(
    filepath=output_file,
    export_format='GLB',
    export_apply=True
)

print(f"✅ Converted: {input_file} → {output_file}")
```

**Utilisation**:
```bash
blender --background --python convert_to_glb.py -- input.fbx output.glb
```

---

## 📋 Liste des 50 Modèles à Télécharger

### Structures (4 modèles)
- [ ] `struct-001.glb` - Base 3x3m → **Sketchfab**: "3x3 exhibition stand"
- [ ] `struct-002.glb` - Base 6x3m → **Sketchfab**: "6x3 trade booth"
- [ ] `struct-003.glb` - Base 9x3m → **Sketchfab**: "large exhibition stand"
- [ ] `struct-004.glb` - Îlot 6x6m → **Sketchfab**: "island booth"

**Recherches alternatives**: "modular exhibition stand", "trade show structure"

---

### Murs et Cloisons (4 modèles)
- [ ] `wall-001.glb` - Mur plein → **Blender**: Créer plane + extrude (5 min)
- [ ] `wall-002.glb` - Mur vitré → **Sketchfab**: "glass partition wall"
- [ ] `wall-003.glb` - Mur LED backlit → **Sketchfab**: "LED panel wall"
- [ ] `wall-004.glb` - Mur courbe → **Sketchfab**: "curved wall panel"

---

### Mobilier (10 modèles)
- [ ] `furn-001.glb` - Comptoir accueil → **Sketchfab**: "reception desk"
- [ ] `furn-002.glb` - Vitrine → **Sketchfab**: "display case glass"
- [ ] `furn-003.glb` - Table haute → **Sketchfab**: "high table"
- [ ] `furn-004.glb` - Table basse → **Sketchfab**: "coffee table modern"
- [ ] `furn-005.glb` - Canapé → **Sketchfab**: "modern sofa"
- [ ] `furn-006.glb` - Fauteuil → **Sketchfab**: "modern armchair"
- [ ] `furn-007.glb` - Chaise → **Sketchfab**: "office chair"
- [ ] `furn-008.glb` - Étagère → **Sketchfab**: "modern shelf"
- [ ] `furn-009.glb` - Bar → **Sketchfab**: "bar counter"
- [ ] `furn-010.glb` - Podium → **Sketchfab**: "presentation podium"

---

### Éclairage (10 modèles)
- [ ] `light-001.glb` - Spot LED → **Sketchfab**: "LED spotlight"
- [ ] `light-002.glb` - Bandeau LED → **Sketchfab**: "LED strip light"
- [ ] `light-003.glb` - Panneau rétroéclairé → **Sketchfab**: "backlit panel"
- [ ] `light-004.glb` - Suspension → **Sketchfab**: "pendant light modern"
- [ ] `light-005.glb` - Projecteur → **Sketchfab**: "projector light"
- [ ] `light-006.glb` - Néon → **Sketchfab**: "neon light"
- [ ] `light-007.glb` - Lampe sur pied → **Sketchfab**: "floor lamp"
- [ ] `light-008.glb` - Applique murale → **Sketchfab**: "wall lamp"
- [ ] `light-009.glb` - Lustre → **Sketchfab**: "chandelier modern"
- [ ] `light-010.glb` - Rampe LED → **Sketchfab**: "LED track light"

---

### Multimédia (5 modèles)
- [ ] `multi-001.glb` - Écran 55" → **Sketchfab**: "55 inch TV screen"
- [ ] `multi-002.glb` - Écran 75" → **Sketchfab**: "75 inch display"
- [ ] `multi-003.glb` - Écran LED géant → **Sketchfab**: "LED video wall"
- [ ] `multi-004.glb` - Borne tactile → **Sketchfab**: "interactive kiosk"
- [ ] `multi-005.glb` - Système audio → **Sketchfab**: "speaker system"

---

### Décoration (7 modèles)
- [ ] `deco-001.glb` - Kakémono → **Sketchfab**: "roll up banner stand"
- [ ] `deco-002.glb` - Drapeau → **Sketchfab**: "flag banner"
- [ ] `deco-003.glb` - Tapis → **Sketchfab**: "modern rug"
- [ ] `deco-004.glb` - Sculpture → **Sketchfab**: "modern sculpture"
- [ ] `deco-005.glb` - Tableau → **Sketchfab**: "modern painting"
- [ ] `deco-006.glb` - Plante → **Sketchfab**: "potted plant modern"
- [ ] `deco-007.glb` - Œuvre d'art → **Sketchfab**: "abstract art"

---

### Sols (3 modèles)
- [ ] `floor-001.glb` - Moquette → **Blender**: Plane avec texture
- [ ] `floor-002.glb` - Parquet → **Poly Haven**: Wood floor
- [ ] `floor-003.glb` - Résine → **Blender**: Plane avec matériau glossy

---

### PLV (Publicité sur Lieu de Vente) (5 modèles)
- [ ] `plv-001.glb` - Totem → **Sketchfab**: "advertising totem"
- [ ] `plv-002.glb` - Comptoir PLV → **Sketchfab**: "promo counter"
- [ ] `plv-003.glb` - Présentoir → **Sketchfab**: "display stand"
- [ ] `plv-004.glb` - Rack brochures → **Sketchfab**: "brochure holder"
- [ ] `plv-005.glb` - Porte-affiches → **Sketchfab**: "poster stand"

---

### Niveaux (3 modèles)
- [ ] `level-001.glb` - Plateforme surélevée → **Blender**: Box + stairs
- [ ] `level-002.glb` - Escalier → **Sketchfab**: "modern stairs"
- [ ] `level-003.glb` - Garde-corps → **Sketchfab**: "modern railing"

---

## 🚀 Plan d'Action Recommandé

### **Jour 1-2: Téléchargement des modèles** (10-15 modèles/jour)

**Priorité P0** (Essentiels pour démo):
1. ✅ struct-002 (base 6x3m)
2. ✅ wall-001 (mur plein)
3. ✅ furn-001 (comptoir)
4. ✅ light-001 (spot LED)
5. ✅ deco-006 (plante)
6. ✅ multi-001 (écran 55")
7. ✅ furn-002 (vitrine)
8. ✅ plv-001 (totem)

**Temps estimé**: 3-4h (recherche + téléchargement + conversion)

---

### **Jour 3: Intégration et tests**

**Étapes**:
1. Placer les fichiers .glb dans `client/public/assets/models/`
2. Vérifier les chemins dans les définitions de modules
3. Tester le chargement 3D
4. Ajuster échelle si nécessaire (scale dans module config)
5. Tester AI Generator avec nouveaux modèles

**Vérification**:
```bash
# Compter les fichiers GLB présents
find client/public/assets/models -name "*.glb" | wc -l

# Lister par catégorie
ls -lh client/public/assets/models/office/
ls -lh client/public/assets/models/electronics/
# etc.
```

---

### **Jour 4-5: Complétion** (modèles secondaires)

**Priorité P1** (Amélioration visuelle):
- Mobilier complet (furn-003 à furn-010)
- Éclairage varié (light-002 à light-010)
- Décoration (deco-001 à deco-007)

**Priorité P2** (Features avancées):
- Structures alternatives (struct-001, 003, 004)
- Multimédia complet
- PLV
- Niveaux

---

## 🔍 Optimisation des Modèles

### **Réduire la taille des fichiers** (important pour performances web)

#### Avec Blender + Draco:
```python
# Export GLB avec compression Draco
bpy.ops.export_scene.gltf(
    filepath=output_file,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,  # ✅ Compression
    export_draco_mesh_compression_level=6,      # Niveau (0-10)
    export_texture_dir='',
    export_apply=True
)
```

**Résultat**: 50-90% de réduction de taille

---

#### Avec gltf-pipeline (CLI):
```bash
# Installation
npm install -g gltf-pipeline

# Compression
gltf-pipeline -i input.glb -o output.glb -d

# Batch
for file in *.glb; do
  gltf-pipeline -i "$file" -o "optimized/$file" -d
done
```

---

### **Décimer la géométrie** (réduire nombre de polygones)

**Dans Blender**:
```
1. Sélectionner le modèle
2. Modifiers → Add Modifier → Decimate
3. Ratio: 0.5 (50% des faces)
4. Apply Modifier
5. Export GLB
```

**Objectif**: < 100KB par modèle simple, < 500KB pour modèles complexes

---

## 📐 Standards de Nommage et Structure

### Structure des dossiers:
```
client/public/assets/models/
├── structures/
│   ├── struct-001.glb
│   ├── struct-002.glb
│   └── ...
├── walls/
│   ├── wall-001.glb
│   └── ...
├── furniture/
│   ├── furn-001.glb
│   └── ...
├── lighting/
│   ├── light-001.glb
│   └── ...
├── multimedia/
│   ├── multi-001.glb
│   └── ...
├── decoration/
│   ├── deco-001.glb
│   └── ...
├── floors/
│   ├── floor-001.glb
│   └── ...
├── plv/
│   ├── plv-001.glb
│   └── ...
└── levels/
    ├── level-001.glb
    └── ...
```

---

### Vérification des chemins dans le code:

**Fichier**: `client/src/lib/3d/gltf-models.ts`

```typescript
export const OFFICE_GLTF_MODULES: GLTFModuleDefinition[] = [
  {
    id: 'desk-001',
    // ✅ Vérifier ce chemin:
    gltfPath: '/assets/models/office/desk-001.glb',
    // ...
  }
];
```

**Important**: Le chemin commence par `/assets/` (pas `/client/public/assets/`)

---

## ✅ Checklist Finale

### Avant intégration:
- [ ] Tous les modèles téléchargés (50/50)
- [ ] Formats corrects (.glb ou .gltf)
- [ ] Taille optimisée (< 500KB par fichier)
- [ ] Licences vérifiées (CC0 ou CC BY)
- [ ] Conversion effectuée si nécessaire

### Après intégration:
- [ ] Fichiers placés dans bons dossiers
- [ ] Chemins vérifiés dans gltf-models.ts
- [ ] Application build sans erreurs
- [ ] Modèles visibles en 3D
- [ ] Échelles correctes
- [ ] Performances acceptables (< 3s chargement)
- [ ] AI Generator fonctionne avec nouveaux modèles

---

## 🎯 Résultat Final

**Avant**: 0/50 modèles (cubes fallback)
**Après**: 50/50 modèles professionnels gratuits

**Budget**: **0€** 🎉
**Temps**: 3-5 jours (selon expérience)
**Qualité**: Professionnelle (Sketchfab, Poly Haven)

---

## 📚 Ressources Additionnelles

### Outils utiles:
- **gltf.report**: https://gltf.report/ (analyser/visualiser GLB)
- **three.js editor**: https://threejs.org/editor/ (tester modèles)
- **Blender**: https://www.blender.org/ (conversion, édition)

### Tutoriels:
- **Blender → GLB**: https://www.youtube.com/results?search_query=blender+export+gltf
- **Optimiser GLTF**: https://www.donmccurdy.com/2020/06/17/color-management-in-threejs/

### Communautés:
- **Sketchfab Discord**: Support conversion
- **Three.js Forum**: https://discourse.threejs.org/
- **r/blender**: Reddit pour aide Blender

---

## ⚡ Script d'Automatisation (Bonus)

**Téléchargement et conversion automatisés**:

```bash
#!/bin/bash
# download_and_convert.sh

# Liste des URLs Sketchfab (exemples)
declare -A MODELS=(
  ["struct-002"]="https://sketchfab.com/3d-models/..."
  ["wall-001"]="https://sketchfab.com/3d-models/..."
  ["furn-001"]="https://sketchfab.com/3d-models/..."
  # ... (à compléter)
)

OUTPUT_DIR="client/public/assets/models"

for model_id in "${!MODELS[@]}"; do
  url="${MODELS[$model_id]}"
  echo "📥 Téléchargement: $model_id"

  # Télécharger (nécessite API Sketchfab ou manuel)
  # wget "$url" -O "temp/$model_id.zip"
  # unzip "temp/$model_id.zip" -d "temp/$model_id/"

  # Trouver fichier source
  source_file=$(find "temp/$model_id/" -name "*.glb" -o -name "*.gltf" | head -1)

  if [ -z "$source_file" ]; then
    # Conversion nécessaire
    source_file=$(find "temp/$model_id/" -name "*.obj" -o -name "*.fbx" | head -1)
    blender --background --python convert_to_glb.py -- "$source_file" "$OUTPUT_DIR/$model_id.glb"
  else
    # Copier directement
    cp "$source_file" "$OUTPUT_DIR/$model_id.glb"
  fi

  echo "✅ $model_id.glb prêt"
done

echo "🎉 Tous les modèles sont prêts!"
```

---

**NOTE**: Le téléchargement depuis Sketchfab nécessite un compte et l'acceptation des licences. Le script ci-dessus est un template - le téléchargement manuel reste la méthode la plus fiable.
