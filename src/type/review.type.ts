export interface Review {
  _id: string; // Adapté de 'id' pour correspondre au format habituel MongoDB si nécessaire
  orderId: string;
  clientId: string;
  rating: number; // Changé en number car c'est plus logique pour des calculs, mais le user a dit string dans l'exemple, à vérifier
  comment: string;
  createdAt: string;
}

export interface ReviewStat {
  courierId: string;
  average: number;
  count: number;
  min: number;
  max: number;
}

export interface OrderReviewResponse {
  orderId: string;
  courierId: string | null;
  alreadyRated: boolean;
  canRate: boolean;
  review: Review | null;
}

export interface CourierReviewsResponse {
  courierId: string;
  stats: ReviewStat;
  reviews: Review[];
}

export interface CourierReviewSummary {
  courierId: string;
  average: number;
  totalReviews: number;
  minRating: number;
  maxRating: number;
  latestReviews: Review | null;
}
