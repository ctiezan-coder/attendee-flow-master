

## Plan : Ajouter un footer sur la page publique des formations

Ajout d'un footer inspiré du design de l'image de référence (fond sombre, colonnes d'informations) en bas de `src/pages/SessionsPublic.tsx`.

### Contenu du footer (4 colonnes) :
1. **Logo + réseaux sociaux** (Facebook, Instagram, X, LinkedIn)
2. **Coordonnées** : Adresse (Immeuble CGRAE, Adjamé-Indénié, Abidjan), Téléphone (+225 27 20 28 67 53 / +225 07 67 22 99 36), Email (info@cotedivoirexport.ci)
3. **Navigation** : Accueil, A propos, Atouts de la Côte d'Ivoire, Offres de services, Programmes, Ressources
4. **Newsletter** : Texte d'invitation + champ email + bouton "S'inscrire"

### Barre de copyright en bas :
- "© Copyright 2025 Agence Côte d'Ivoire Export"
- Liens "Politique de confidentialité" et "Cookies"

### Technique :
- Style : fond `bg-zinc-900` texte blanc, accent orange pour les boutons/icônes
- Ajout direct dans le JSX de `SessionsPublic.tsx` avant la fermeture du `</div>` principal
- Responsive : grille 1→2→4 colonnes

