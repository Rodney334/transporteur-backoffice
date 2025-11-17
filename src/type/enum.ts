export enum GrantedRole {
  Admin = "admin",
  Livreur = "livreur",
  Operateur = "operateur",
  Client = "client",
  User = "user",
}

export enum GenderType {
  Man = "man",
  Women = "women",
  Other = "other",
}

export enum OrderStatus {
  EN_ATTENTE = "en_attente",
  ASSIGNEE = "assignee",
  EN_DISCUSSION = "en_discussion_tarifaire",
  PRIX_VALIDE = "prix_valide",
  EN_LIVRAISON = "en_livraison",
  LIVREE = "livree",
  ECHEC = "echec",
}

const STATUS_FLOW: OrderStatus[] = [
  OrderStatus.EN_ATTENTE,
  OrderStatus.ASSIGNEE,
  OrderStatus.EN_DISCUSSION,
  OrderStatus.PRIX_VALIDE,
  OrderStatus.EN_LIVRAISON,
  OrderStatus.LIVREE,
];

export enum NegotiationStatus {
  EN_ATTENTE = "en_attente",
  PRIX_VALIDE = "prix_valide",
  EN_CONFLIT = "en_conflit",
  ARBITRE = "arbitre_admin",
  EN_DISCUSSION = "en_discussion_tarifaire",
}

export enum PaymentMethod {
  CASH = "cash",
  MOBILE_MONEY = "mobile_money",
  CARD = "card",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum DeliveryType {
  EXPRESS = "express",
  STANDARD = "standard",
}

export enum ServiceType {
  COURRIER = "courrier",
  COLIS = "colis",
  TRANSPORT = "transport",
}

export enum TransportMode {
  MOTO = "MOTO",
  VOITURE = "VOITURE",
  CAMION = "CAMION",
  VELO = "VELO",
}

export enum ArticleType {
  DOCUMENT = "document",
  COLIS = "colis",
  FRAGILE = "fragile",
  ALIMENTAIRE = "alimentaire",
  ELECTRONIQUE = "electronique",
  AUTRE = "autre",
}
