// types/command-card.type.ts
export interface FormattedOrder {
  id: string;
  reference: string;
  date: string;
  departure: string;
  arrival: string;
  originalData: any; // Garder les données originales pour les callbacks
}

export interface CommandCardProps {
  command: FormattedOrder;
  onReject: (command: FormattedOrder) => void;
  onAccept: (command: FormattedOrder) => void;
  onViewDetails: (command: FormattedOrder) => void;
}
