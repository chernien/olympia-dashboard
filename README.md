<div align="center">

# 🛍️ StoreOlympia 

### Boutique e-commerce B2B pour la commande en ligne du catalogue Olympia

Application web **Angular 15** permettant aux clients, contacts et commerciaux (VRP) de parcourir le catalogue, consulter leurs **tarifs et remises personnalisés**, gérer un panier et passer commande, en se connectant à l'**API Olympia (.NET)**.

[![Angular](https://img.shields.io/badge/Angular-15-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Angular Material](https://img.shields.io/badge/Angular%20Material-15-607D8B?logo=angular&logoColor=white)](https://material.angular.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-Template%20Molla-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Platform](https://img.shields.io/badge/Platform-Web-success)](#)

</div>

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration de l'environnement](#-configuration-de-lenvironnement)
- [Routes & accès](#-routes--accès)
- [Gestion de l'état](#-gestion-de-létat)
- [Points techniques intéressants](#-points-techniques-intéressants)
- [Écosystème du projet](#-écosystème-du-projet)
- [Améliorations futures](#-améliorations-futures)
- [Auteur](#-auteur)
- [Licence](#-licence)

---

## 🎯 Présentation

**Olympia Client** est l'interface web e-commerce d'une solution de **vente B2B**. C'est le pendant « front client » de l'**API Olympia (.NET)** : là où l'API expose le catalogue ERP, la tarification et les commandes, ce storefront permet aux utilisateurs de **commander en ligne** avec leurs conditions commerciales propres.

Particularité B2B : le prix n'est pas universel. Selon qu'on se connecte en tant que **client**, **contact** ou **commercial (VRP)**, l'application résout le **tarif** et les **remises** applicables avant l'ajout au panier.

| | |
|---|---|
| **Objectif** | Parcourir le catalogue et passer commande avec tarification personnalisée par client |
| **Public cible** | Clients B2B, contacts, commerciaux (VRP) |
| **Plateforme** | Application web (navigateur desktop) |
| **Type** | Storefront e-commerce (SPA) connecté à une API REST |

> 🔒 **Note** : ce dépôt est une version *portfolio*. L'URL de l'API a été retirée du suivi Git et remplacée par un modèle — voir [Configuration de l'environnement](#-configuration-de-lenvironnement).

---

## 👀 Aperçu

Le parcours utilisateur suit le flux classique d'un e-commerce, protégé par authentification :

```
Connexion (client / contact / commercial)
   └─ Espace authentifié (/home)
        ├─ Catalogue : vues boutique (2/3/4 colonnes, liste) & catégories
        ├─ Fiche produit : tarif + remise résolus selon le client
        ├─ Panier : ajout / quantités / total (persisté localement)
        ├─ Liste de souhaits (wishlist)
        ├─ Compte client & gestionnaire de mot de passe
        └─ Administration / invités (gestion annexe)
```

L'accès à l'espace `/home` est conditionné par un **`AuthGuard`** : un utilisateur non connecté est redirigé vers la page de connexion.

---

## ✨ Fonctionnalités

### 🔐 Authentification multi-acteurs
- Connexion **client**, **contact** et **commercial (VRP)** via trois endpoints dédiés.
- Session persistée en `localStorage` (`loggedIn` + utilisateur courant).
- Protection des routes de l'espace authentifié par un **`AuthGuard`**.
- Gestionnaire de **mot de passe** (changement) et inscription.

### 🛒 Catalogue & boutique
- Plusieurs **mises en page boutique** : grilles **2 / 3 / 4 colonnes** et vue **liste**.
- Navigation par **famille** et par **catégorie** (`category/:category`).
- **Fiche produit** détaillée (`product/:id`) avec variantes (sous-références).
- **Pipes de recherche/filtrage** côté client (`product`, `produit`, `sref`).

### 💰 Tarification B2B
- Résolution du **tarif** d'un article selon le client connecté.
- Application des **remises** par référence et code remise (`TarRemise`, `Remise`).
- Récupération des **modes de règlement**.

### 🛍️ Panier & souhaits
- **Panier** géré en `localStorage` : ajout, mise à jour des quantités, suppression, calcul du total.
- **Wishlist** sur le même principe.
- Préparation de commande à partir du panier (adresses facturation / livraison).

### 👤 Espace client & administration
- **Compte client** (consultation des informations).
- Vues **administration** et **invités** (`guest`) pour la gestion annexe.

### 🎨 Expérience utilisateur
- Composants **Angular Material** (select, form-field, card, snackbar) + **recherche dans les listes** (`ngx-mat-select-search`).
- Notifications et confirmations élégantes via **SweetAlert2**.
- Thème **Molla / Bootstrap** (carousel, popups, sliders) pour un rendu e-commerce soigné.

---

## 🛠 Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| **Angular 15** | Framework applicatif (NgModules, routing, DI) |
| **TypeScript 4.9** | Langage typé |
| **RxJS 7.8** | Programmation réactive, flux HTTP (`HttpClient`) |
| **Angular Material 15** | Composants UI (select, form-field, card, snackbar…) |
| **ngx-mat-select-search** | Recherche dans les listes déroulantes |
| **SweetAlert2** | Modales, alertes et confirmations |
| **Bootstrap (template Molla)** | Mise en page et composants e-commerce (via `assets/`) |
| **Jasmine + Karma** | Tests unitaires |

> ℹ️ Le `package.json` embarque aussi NgRx, `@ngx-translate`, Syncfusion, `ngx-toastr` et `@ng-select/ng-select` (héritage du template), mais ces librairies **ne sont pas câblées** dans `app.module.ts`. Le tableau ci-dessus ne liste que ce qui est réellement utilisé.

---

## 📁 Structure du projet

```
Olympia_Client_nouveau/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/ register/          # Authentification
│   │   │   ├── home/                      # Shell de l'espace authentifié
│   │   │   ├── header/ footer/ layout/    # Layout commun & accueil
│   │   │   ├── shop/                       # ⭐ Boutique : 2/3/4 colonnes + liste
│   │   │   ├── product/                    # Fiche produit (default / extended)
│   │   │   ├── category/                   # Navigation par catégorie
│   │   │   ├── cart/ wishlist/             # Panier & souhaits
│   │   │   ├── account-client/ password-manager/  # Espace client
│   │   │   ├── administration/ guest/      # Gestion annexe
│   │   │   └── about-us/ contact-us/ not-found/
│   │   ├── services/
│   │   │   ├── article.service.ts          # Catalogue, tarifs, remises, commande
│   │   │   ├── client.service.ts           # Auth, clients, contacts, commerciaux
│   │   │   ├── guest.service.ts            # CRUD invités
│   │   │   ├── cart.service.ts             # Panier (localStorage)
│   │   │   └── wishlist.service.ts         # Wishlist (localStorage)
│   │   ├── guards/auth.guard.ts            # Protection des routes
│   │   ├── pipes/                          # product / produit / sref (filtrage)
│   │   ├── core/                           # ⚠️ Scaffolding NgRx du template (non câblé)
│   │   ├── app.module.ts                   # Module racine (NgModules)
│   │   └── app-routing.module.ts           # Routage & guards
│   ├── environments/                       # Configuration d'API (base_url)
│   ├── assets/                             # Thème Molla (CSS, plugins, images)
│   └── styles.css
└── angular.json                            # Configuration de build
```

> 💡 **Cœur métier** : [`article.service.ts`](src/app/services/article.service.ts) couvre plusieurs contrôleurs back-end (Art, TarRemise, Remise, Adresses).

---

## 🚀 Installation

### Prérequis

- **Node.js** ≥ 16 et **npm**
- **Angular CLI 15** : `npm install -g @angular/cli@15`

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-compte>/olympia-client.git
cd olympia-client

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement (voir section suivante)
cp src/environments/environment.example.ts src/environments/environment.ts

# 4. Lancer le serveur de développement
npm start
```

L'application est disponible sur `http://localhost:4200`.

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Serveur de développement (`ng serve`) |
| `npm run build` | Build de production → `dist/` |
| `npm run watch` | Build incrémental en mode développement |
| `npm test` | Tests unitaires (Karma / Jasmine) |

---

## ⚙️ Configuration de l'environnement

L'URL de l'API back-end se configure dans les fichiers d'environnement Angular. Un modèle versionné est fourni :

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  base_url: "https://votre-api-backend.com"   // ← URL de l'API Olympia (.NET)
};
```

> ⚠️ Les fichiers `environment.ts` / `environment.prod.ts` sont **ignorés par Git** (voir `.gitignore`) afin de ne pas exposer l'URL de l'API. Copiez `environment.example.ts` après chaque clone. En production, `ng build` remplace `environment.ts` par `environment.prod.ts` via `fileReplacements` (`angular.json`).

---

## 🔐 Routes & accès

| Route | Composant | Accès |
|-------|-----------|-------|
| `/` | Connexion | Public |
| `/home` | Accueil / landing | **Authentifié** |
| `/home/shop-list` · `/home/shop-2columns` · `/home/shop-3columns` · `/home/shop-4columns` | Boutique | **Authentifié** |
| `/home/product/:id` | Fiche produit | **Authentifié** |
| `/home/category/:category` | Catégorie | **Authentifié** |
| `/home/cart` · `/home/wishlist` | Panier / souhaits | **Authentifié** |
| `/home/account` · `/home/password-manager` | Espace client | **Authentifié** |
| `/home/administration` · `/home/guest` | Gestion annexe | **Authentifié** |
| `**` | Page 404 | Public |

Toutes les routes sous `/home` sont protégées par l'**`AuthGuard`**.

---

## 🧠 Gestion de l'état

- **Panier & wishlist** : gérés par des **services dédiés** (`cart.service.ts`, `wishlist.service.ts`) qui maintiennent l'état en mémoire et le **persistent dans `localStorage`** — c'est la source de vérité réelle.
- **Session** : `loggedIn` et l'utilisateur courant sont stockés dans `localStorage` et lus par l'`AuthGuard`.
- **Données serveur** : récupérées à la demande via `HttpClient` + RxJS, sans cache global.

> ⚠️ Un dossier `core/` contient des **reducers / actions / selectors NgRx** issus du template d'origine, mais `StoreModule` **n'est pas importé** dans `app.module.ts` : ce code est **dormant**. La gestion d'état effective passe par les services ci-dessus.

---

## 🧠 Points techniques intéressants

- **Couche de services par domaine** : séparation nette (catalogue/tarifs, clients/auth, invités, panier) et regroupement des appels API par contrôleur back-end.
- **Tarification B2B côté client** : résolution dynamique du tarif + remise selon l'acteur connecté avant l'ajout au panier.
- **Authentification multi-rôles** : trois flux de connexion (client / contact / commercial) vers des endpoints distincts.
- **Persistance locale** : panier, wishlist et session survivent au rechargement via `localStorage`.
- **Pipes de filtrage réutilisables** : recherche client-side sur les listes de produits (`product`, `produit`, `sref`).
- **Programmation réactive** : flux HTTP gérés via RxJS et `HttpClient`.

---

## 🔗 Écosystème du projet

Ce storefront fait partie de la solution Olympia :

| Composant | Rôle | Stack |
|-----------|------|-------|
| **Olympia API** | Back-end REST & logique métier (catalogue, tarifs, commandes, SMS) | ASP.NET Core 6 |
| **Olympia Client** *(ce dépôt)* | Storefront e-commerce B2B | Angular 15 |
| **ERP DIVA / OLYMPIA** | Source des données | SQL Server |

---

## 🔮 Améliorations futures

- [ ] **Intercepteur HTTP** pour centraliser l'authentification et la gestion des erreurs.
- [ ] Renforcer le typage (interfaces dédiées plutôt que `any`).
- [ ] Migration vers les **composants standalone** d'Angular et le **lazy loading**.
- [ ] Choisir une stratégie d'état claire : soit activer NgRx, soit retirer le scaffolding `core/` inutilisé.
- [ ] Corriger l'URL **codée en dur** (`getTacod`) pour utiliser `environment.base_url`.
- [ ] Nettoyer les assets de template non utilisés (`assets/css/demos`, `skins`).
- [ ] Mettre en place une **CI/CD** (lint + tests + build).

---

## 👤 Auteur

> _À compléter avec vos informations._

**[Votre nom complet]**
*Développeur Full-Stack (.NET / Angular)*

[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://github.com/votre-compte)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/votre-profil)
[![Email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:vous@exemple.com)
<div align="center">

⭐️ Si ce projet vous a plu, n'hésitez pas à laisser une étoile !

</div>
