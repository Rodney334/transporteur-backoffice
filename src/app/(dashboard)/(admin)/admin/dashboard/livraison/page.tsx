"use client";

import { Package, PackageCheck } from "lucide-react";
import { DeliveryCardInterface, HistoriqueDataType } from "./types/type";
import { DeliveryCard } from "./components/DeliveryCard";

export default function LivraisonPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Livraison</h1>
      <p>Interface d'administration réservée aux administrateurs.</p>
    </div>
  );
}
