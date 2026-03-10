// utils/error-handler.ts

export const getFriendlyErrorMessage = (error: any): string => {
  // Si c'est déjà une chaîne de caractères, on la retourne
  if (typeof error === 'string') return error;

  const response = error?.response;
  const status = response?.status;
  const apiMessage = response?.data?.message;

  // Mapping des messages d'erreur spécifiques de l'API (si connus)
  if (apiMessage) {
    if (apiMessage.includes("Invalid credentials") || apiMessage.includes("Unauthorized")) {
      return "Identifiants incorrects. Veuillez réessayer.";
    }
    if (apiMessage.includes("not found")) {
      return "La ressource demandée est introuvable.";
    }
    if (apiMessage.includes("already exists")) {
      return "Cette information existe déjà dans notre système.";
    }
    if (apiMessage.includes("Promo code not valid")) {
      return "Ce code promo n'est pas valide ou a expiré.";
    }
    // Ajoutez d'autres mappings spécifiques ici
  }

  // Mapping basé sur les codes de statut HTTP
  switch (status) {
    case 400:
      return "La requête est invalide. Veuillez vérifier les informations saisies.";
    case 401:
      return "Vous n'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.";
    case 403:
      return "Accès refusé. Vous n'avez pas les permissions nécessaires.";
    case 404:
      return "Ressource introuvable.";
    case 409:
      return "Un conflit est survenu. Cette ressource peut déjà exister.";
    case 422:
      return "Les données fournies sont invalides. Veuillez corriger les erreurs.";
    case 429:
      return "Trop de requêtes. Veuillez patienter un moment avant de réessayer.";
    case 500:
      return "Une erreur interne du serveur est survenue. Nos équipes travaillent à sa résolution.";
    case 502:
    case 503:
    case 504:
      return "Le service est temporairement indisponible. Veuillez réessayer plus tard.";
    default:
      return apiMessage || "Une erreur inattendue est survenue. Veuillez réessayer.";
  }
};
