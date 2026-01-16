# Générateur de Stands par IA

Le Stand-Planet inclut un générateur de stands alimenté par l'IA (OpenAI GPT-4) qui crée automatiquement des configurations de stands professionnelles basées sur vos descriptions.

## 🚀 Fonctionnalités

- **Génération automatique** : Décrivez votre besoin en langage naturel
- **3 variations** : Chaque génération produit 3 designs différents (Base, Minimaliste, Premium)
- **Mode démo** : Fonctionne même sans clé API (utilise un design par défaut)
- **Personnalisation** : Précisez dimensions, budget, secteur, style et exigences
- **Suggestions rapides** : Templates prédéfinis pour démarrer rapidement

## 🔑 Configuration de la clé API OpenAI

### Option 1 : Mode démo (aucune clé requise)

Sans clé API, le générateur créera automatiquement un **Stand Standard** avec :
- Structure de base (6x3m)
- Mur arrière blanc
- Comptoir d'accueil
- Éclairage professionnel (2 spots)
- Plante décorative

Ce stand sert de point de départ et peut être personnalisé ensuite.

### Option 2 : Utiliser votre clé API OpenAI

Pour générer des stands personnalisés avec l'IA :

1. **Obtenir une clé API**
   - Créez un compte sur https://platform.openai.com
   - Allez dans API Keys : https://platform.openai.com/api-keys
   - Créez une nouvelle clé secrète
   - Copiez la clé (elle commence par `sk-...`)

2. **Configurer la clé dans Stand-Planet**
   ```javascript
   // Dans la console du navigateur ou via l'interface
   localStorage.setItem('openai_api_key', 'sk-votre-clé-api-ici');
   ```

3. **Vérifier la configuration**
   ```javascript
   // Vérifier que la clé est bien enregistrée
   console.log(localStorage.getItem('openai_api_key') ? '✅ Clé configurée' : '❌ Pas de clé');
   ```

⚠️ **Important** :
- Ne partagez JAMAIS votre clé API
- La clé est stockée localement dans votre navigateur uniquement
- Coût : ~$0.01-0.05 par génération (GPT-4 Turbo)

## 📖 Utilisation

### Interface utilisateur

1. Accédez à l'**Assistant IA** dans Stand-Planet
2. Décrivez votre besoin en français :
   - "Un stand moderne de 9x6m pour une entreprise tech avec écrans LED"
   - "Stand luxueux pour bijouterie avec vitrine et éclairage doux"
   - "Stand écologique avec matériaux naturels et plantes"

3. (Optionnel) Précisez les paramètres :
   - **Dimensions** : largeur x profondeur (ex: 6x3m)
   - **Budget** : budget maximum en euros
   - **Secteur** : tech, luxe, écologie, industrie...
   - **Style** : moderne, luxe, minimaliste, industriel, créatif
   - **Exigences** : liste d'éléments obligatoires

4. Cliquez sur **Générer** et attendez 5-10 secondes

5. Explorez les **3 variations** générées :
   - **Version de base** : Design principal
   - **Version minimaliste** : Version épurée (-50% de modules)
   - **Version premium** : Version enrichie avec éclairage et déco supplémentaires

### Utilisation programmatique

```typescript
import { useAIGenerator } from '@/hooks/use-ai-generator';

function MyComponent() {
  const { generate, isGenerating, configurations, error } = useAIGenerator({
    onSuccess: (configs) => {
      console.log('✅ Généré:', configs.length, 'designs');
    },
    onError: (err) => {
      console.error('❌ Erreur:', err.message);
    }
  });

  const handleGenerate = async () => {
    try {
      const result = await generate(
        'Stand moderne pour salon tech',
        {
          dimensions: { width: 9, depth: 6 },
          budget: 15000,
          industry: 'tech',
          style: 'modern',
          requirements: ['Écrans LED', 'Zone démo', 'Comptoir']
        }
      );

      console.log('Configurations générées:', result);
    } catch (err) {
      console.error('Erreur génération:', err);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isGenerating}>
      {isGenerating ? 'Génération...' : 'Générer un stand'}
    </button>
  );
}
```

## 🎯 Suggestions rapides prédéfinies

### Stand Tech Moderne
```typescript
{
  prompt: 'Stand moderne pour entreprise technologique avec écrans LED, éclairage dynamique et design épuré',
  industry: 'tech',
  style: 'modern',
  requirements: ['Écrans LED', 'Espace démonstration', 'Borne tactile']
}
```

### Stand Luxe
```typescript
{
  prompt: 'Stand luxueux haut de gamme avec matériaux nobles et ambiance premium',
  industry: 'luxury',
  style: 'luxury',
  requirements: ['Mobilier design', 'Éclairage d\'ambiance', 'Espace VIP']
}
```

### Stand Écologique
```typescript
{
  prompt: 'Stand écologique et naturel avec matériaux durables et plantes',
  industry: 'eco',
  style: 'minimal',
  requirements: ['Matériaux naturels', 'Plantes', 'Éclairage doux']
}
```

### Stand Interactif
```typescript
{
  prompt: 'Stand interactif avec zones de démonstration et expériences immersives',
  industry: 'general',
  style: 'creative',
  requirements: ['Bornes tactiles', 'Écrans multiples', 'Espace démo']
}
```

## 🧠 Comment fonctionne l'IA ?

1. **Analyse du prompt** : L'IA comprend votre besoin en langage naturel
2. **Sélection de modules** : Choix parmi 50+ modules disponibles (murs, mobilier, éclairage...)
3. **Placement intelligent** :
   - Structure en premier
   - Murs sur les bords
   - Mobilier ergonomique au centre
   - Éclairage en hauteur
   - Décoration pour compléter
4. **Optimisation** : Respect des dimensions, budget et contraintes
5. **Variations** : Génération de 3 versions (base, minimaliste, premium)

## 📦 Modules disponibles pour l'IA

L'IA peut utiliser les modules suivants :

### Structures
- `struct-001` à `004` : Bases (3x3m, 6x3m, 9x3m, îlot 6x6m)

### Murs et cloisons
- `wall-001` à `004` : Murs (plein, vitré, LED, courbe)

### Mobilier
- `furn-001` à `006` : Comptoirs, vitrines, tables, canapés, étagères

### Éclairage
- `light-001` à `010` : Spots, bandeaux LED, suspensions, néons

### Multimédia
- `multi-001` à `005` : Écrans, bornes tactiles, audio

### Décoration
- `deco-001` à `007` : Plantes, kakémonos, tapis, sculptures, art

### Sols
- `floor-001` à `003` : Moquette, parquet, résine

## 🔧 Dépannage

### ❌ "Erreur lors de la génération du design"

**Causes possibles** :
- Clé API invalide ou expirée
- Quota OpenAI dépassé
- Problème de connexion internet

**Solutions** :
1. Vérifiez votre clé API : https://platform.openai.com/api-keys
2. Vérifiez votre crédit OpenAI : https://platform.openai.com/usage
3. Testez en mode démo (sans clé API)

### ⚠️ Le design généré est vide

**Solution** : Le mode démo crée maintenant automatiquement un Stand Standard avec des modules. Si vous voyez toujours un stand vide, rechargez la page.

### 💰 Coûts OpenAI

- **GPT-4 Turbo** : ~$0.01 par 1K tokens input, ~$0.03 par 1K tokens output
- **Estimation** : ~500 tokens input + 1000 tokens output = ~$0.04 par génération
- **3 variations** : ~$0.04 (génération base) + minimal overhead pour variations

## 🚀 Prochaines améliorations

- [ ] Interface de configuration API directement dans l'app
- [ ] Support d'autres modèles IA (Claude, Mistral)
- [ ] Historique des générations
- [ ] Édition itérative avec l'IA
- [ ] Export/Import de prompts
- [ ] Bibliothèque de prompts communautaires

## 📚 Documentation supplémentaire

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GPT-4 Guide](https://platform.openai.com/docs/guides/gpt)
- [Stand-Planet Modules Reference](./docs/MODULES.md)
