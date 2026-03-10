// utils/form-labels.ts

export const ORDER_FORM_LABELS: Record<string, string> = {
  articleType: "Type d'article",
  deliveryCity: "Ville de livraison",
  deliveryCountry: "Pays de livraison",
  deliveryName: "Nom du destinataire",
  deliveryPhone: "Téléphone du destinataire",
  deliveryType: "Type de livraison",
  description: "Description",
  pickupCity: "Ville de départ",
  pickupCountry: "Pays de départ",
  pickupName: "Nom de l'expéditeur",
  pickupPhone: "Téléphone de l'expéditeur",
  scheduledAt: "Heure de la livraison",
  promoCodeId: "Code promo",
  transportMode: "Mode de transport",
  weight: "Poids",
  zone: "Zone",
  pickupDistrict: "Quartier de départ",
  pickupStreet: "Rue de départ",
  deliveryDistrict: "Quartier de livraison",
  deliveryStreet: "Rue de livraison",
};

export const getFieldLabel = (key: string): string => {
  return ORDER_FORM_LABELS[key] || key;
};
