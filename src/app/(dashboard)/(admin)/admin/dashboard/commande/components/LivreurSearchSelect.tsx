// components/LivreurSearchSelect.tsx - VERSION AVEC LOADING
"use client";

import { useState, useMemo } from "react";
import { Search, User, Phone, MapPin, Loader2 } from "lucide-react";
import { User as UserType } from "@/type/user.type";

interface LivreurSearchSelectProps {
  livreurs: UserType[];
  selectedLivreur: UserType | null;
  onSelectLivreur: (livreur: UserType) => void;
  isLoading?: boolean;
}

export const LivreurSearchSelect = ({
  livreurs,
  selectedLivreur,
  onSelectLivreur,
  isLoading = false,
}: LivreurSearchSelectProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filtrer les livreurs basé sur la recherche
  const filteredLivreurs = useMemo(() => {
    if (!searchQuery.trim()) return livreurs;

    const query = searchQuery.toLowerCase();
    return livreurs.filter(
      (livreur) =>
        livreur.name.toLowerCase().includes(query) ||
        livreur.email.toLowerCase().includes(query) ||
        livreur.phoneNumber.toLowerCase().includes(query)
    );
  }, [livreurs, searchQuery]);

  const handleSelect = (livreur: UserType) => {
    onSelectLivreur(livreur);
    setIsOpen(false);
    setSearchQuery(livreur.name);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sélectionner un livreur
      </label>

      {/* Champ de recherche */}
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (livreurs.length > 0) setIsOpen(true);
          }}
          placeholder={
            isLoading
              ? "Chargement des livreurs..."
              : "Rechercher un livreur par nom, email ou téléphone..."
          }
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all duration-200"
          disabled={isLoading}
        />
      </div>

      {/* Dropdown avec résultats */}
      {isOpen && !isLoading && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {livreurs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucun livreur disponible
              </div>
            ) : filteredLivreurs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery
                  ? "Aucun livreur trouvé"
                  : "Aucun livreur disponible"}
              </div>
            ) : (
              <ul className="py-2">
                {filteredLivreurs.map((livreur) => (
                  <li key={livreur._id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(livreur)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedLivreur?._id === livreur._id
                          ? "bg-[#FD481A]/10 border-l-4 border-[#FD481A]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-[#FD481A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {livreur.name}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-3 h-3 mr-1" />
                              {livreur.phoneNumber}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {livreur.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Livreur sélectionné */}
      {selectedLivreur && !isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FD481A]/20 rounded-full flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-[#FD481A]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {selectedLivreur.name}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="text-sm text-gray-500">
                  📞 {selectedLivreur.phoneNumber}
                </span>
                <span className="text-sm text-gray-500">
                  ✉️ {selectedLivreur.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
