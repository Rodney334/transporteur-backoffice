// components/InfoSection/InfoLivreurSection.tsx
"use client";

import { useState, useEffect } from "react";
import { userService } from "@/lib/services/user-service";
import { User } from "@/type/user.type";
import { Truck } from "lucide-react";

interface InfoLivreurSectionProps {
  assignedTo: string | null | undefined;
}

export const InfoLivreurSection = ({ assignedTo }: InfoLivreurSectionProps) => {
  const [livreur, setLivreur] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLivreurInfo = async () => {
      if (!assignedTo || typeof assignedTo !== "string") {
        setLivreur(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const livreurData = await userService.getUserById(assignedTo);
        setLivreur(livreurData);
      } catch (err: any) {
        console.error("Erreur chargement livreur:", err);
        setError("Impossible de charger les informations du livreur");
        setLivreur(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLivreurInfo();
  }, [assignedTo]);

  if (!assignedTo) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-gray-50 to-slate-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Informations livreur
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="text-gray-400 mb-2">
            <Truck className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            Aucun livreur assigné à cette commande
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-purple-50 to-violet-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Informations livreur
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FD481A]"></div>
          </div>
          <p className="text-sm text-gray-500">
            Chargement des informations...
          </p>
        </div>
      </div>
    );
  }

  if (error || !livreur) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-purple-50 to-violet-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Informations livreur
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <Truck className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {error || "Informations du livreur non disponibles"}
            </p>
            <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
              ID livreur: {assignedTo}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-purple-50 to-violet-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Informations livreur
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Nom :</span>
          <span className="text-gray-800 text-right flex-1">
            {livreur.name || "Non spécifié"}
          </span>
        </div>

        {/* {livreur.email && (
          <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-600 min-w-20">Email :</span>
            <span className="text-gray-800 text-right flex-1">
              {livreur.email}
            </span>
          </div>
        )} */}

        {livreur.phoneNumber && (
          <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-600 min-w-20">Tel :</span>
            <span className="text-gray-800 text-right flex-1">
              {livreur.phoneNumber}
            </span>
          </div>
        )}

        {livreur.role && (
          <div className="flex justify-between items-start">
            <span className="font-medium text-gray-600 min-w-20">Rôle :</span>
            <span className="text-gray-800 text-right flex-1 capitalize">
              {livreur.role}
            </span>
          </div>
        )}

        {/* <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
            ID: {assignedTo}
          </div>
        </div> */}
      </div>
    </div>
  );
};
