# Contribuer

Merci de l'intérêt porté au projet. Ce document décrit les conventions de code
attendues dans les contributions.

## Mise en route

```bash
npm install
cp .env.example .env.local   # facultatif
npm run dev
```

Avant d'ouvrir une pull request :

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Style de code

Le formatage suit la configuration ESLint du dépôt. Les composants sont écrits
en TypeScript, l'état partagé passe par un store Zustand, et les styles par les
tokens définis dans `app/globals.css` plutôt que par des couleurs en dur.

## Commentaires

Le code doit se lire seul. Un commentaire survit seulement s'il explique un
« pourquoi » que le code ne montre pas. Ils sont écrits en anglais, courts, sur
le ton d'une note laissée à un collègue.

### Où commenter

1. **Une contrainte ou un piège** : hydratation, SSR, comportement navigateur,
   ce qui casse si quelqu'un simplifie la ligne.
2. **Un contournement** de bug ou de limite d'une librairie.
3. **Une règle métier ou de sécurité** : quota, rate limit, validation à refaire
   côté serveur.
4. **Un point d'extension** où l'on branche son backend (`authorize()`, une
   interface de stockage) : une à trois lignes sur ce qu'on branche et ce que
   l'implémentation doit garantir. Le JSDoc n'est admis que là, quand le type
   ne dit pas tout.
5. **Un `TODO:` ou `FIXME:`** seulement s'il dit quoi et pourquoi.

### En-tête de fichier

Réservé aux modules à logique métier (rate limit, validation, droits, stores qui
orchestrent) : 2 à 4 lignes, ce que fait le module et la seule chose à ne pas
casser. Pas d'en-tête sur un composant d'interface, pas de licence en tête de
fichier.

### Où ne pas commenter

- Pour répéter le code ou le nom d'une variable.
- Pour des bannières ou séparateurs de section, ou pour étiqueter du JSX.
- Pour du code mis en commentaire ou une note d'historique.
- Pour décrire l'architecture d'un dossier : cela va dans le README.
- Pour justifier un choix de design : cela va dans le message de commit ou la
  pull request.

### Forme

Une ligne le plus souvent, trois au maximum. Syntaxe `//` uniquement, un
fragment en minuscules est acceptable. Pas de formule solennelle, pas
d'adjectif creux, pas d'emoji.

```ts
// api returns 200 even on failure, check the body

// first x-forwarded-for hop is client-controlled unless a proxy overwrites it
```

On garde toujours `eslint-disable`, `@ts-expect-error`, `@ts-ignore` et les
directives `/// <reference>`.

## Messages de commit

Une ligne de résumé à l'impératif, sous cinquante caractères, puis un corps
facultatif qui explique le pourquoi. Pas de préfixe imposé.

```
Extraire la boucle de streaming dans streamInto

La régénération dupliquait le chemin réseau de sendMessage, ce qui rendait
l'annulation impossible à maintenir sur les deux trajets.
```
