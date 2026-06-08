// Modèle de configuration — copier en `environment.ts` puis renseigner l'URL.
//   cp src/environments/environment.example.ts src/environments/environment.ts
//
// `ng build --prod` remplace `environment.ts` par `environment.prod.ts`
// (voir `fileReplacements` dans angular.json).

export const environment = {
  production: false,
  base_url: "https://votre-api-backend.com"   // ← URL de l'API Olympia (.NET)
};
