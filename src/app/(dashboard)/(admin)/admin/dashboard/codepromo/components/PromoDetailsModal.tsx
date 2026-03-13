// components/PromoDetailsModal.tsx
"use client";

import {
  X,
  Tag,
  Calendar,
  Clock,
  Percent,
  Users,
  Building2,
  User,
  Target,
  AlertCircle,
} from "lucide-react";
import { usePromos } from "../hooks";

export default function PromoDetailsModal() {
  const {
    selectedPromo,
    closeDetailsModal,
    formatDate,
    formatPromoType,
    getActiveStatusColor,
  } = usePromos();

  if (!selectedPromo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* En-tête fixe */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Tag className="w-6 h-6 text-[#FD481A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Détails du code promo
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Code :{" "}
                  <span className="font-mono font-bold">
                    {selectedPromo.code}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={closeDetailsModal}
              className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Section 1: Informations générales */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Informations générales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Code promo
                  </label>
                  <div className="text-lg font-bold text-[#FD481A]">
                    {selectedPromo.code}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Canal
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedPromo.channel === "PUBLIC"
                      ? "Public"
                      : selectedPromo.channel === "PARTNER"
                        ? "Partenaire"
                        : "VIP"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Statut
                  </label>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getActiveStatusColor(
                      selectedPromo.isActive,
                    )}`}
                  >
                    {selectedPromo.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Type de réduction
                  </label>
                  <div className="flex items-center gap-2">
                    {selectedPromo.type === "PERCENT" ? (
                      <>
                        <Percent className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-900">
                          Pourcentage
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-gray-900">
                          Montant fixe
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Valeur
                  </label>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPromoType(selectedPromo.type, selectedPromo.value)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ID
                  </label>
                  <div className="text-xs font-mono text-gray-500 bg-white p-2 rounded border">
                    {selectedPromo.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Période de validité */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Période de validité
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Date de création
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedPromo.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de début
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedPromo.startsAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de fin
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedPromo.endsAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Limitations d'utilisation */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Limitations d'utilisation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Limite utilisateur
                  </label>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedPromo.usageLimit?.toLocaleString() || "Illimité"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Limite par utilisateur
                  </label>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedPromo.usageLimitPerUser?.toLocaleString() ||
                      "Illimité"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Montant minimum commande
                  </label>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedPromo.minOrderAmount > 0
                      ? new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                          minimumFractionDigits: 0,
                        }).format(selectedPromo.minOrderAmount)
                      : "Aucun minimum"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Remise maximale
                  </label>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedPromo.maxDiscount
                      ? new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                          minimumFractionDigits: 0,
                        }).format(selectedPromo.maxDiscount)
                      : "Illimitée"}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Éligibilité */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Éligibilité
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Mode d'éligibilité
                  </label>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedPromo.eligibilityMode === "USERS"
                      ? "Utilisateurs spécifiques"
                      : selectedPromo.eligibilityMode === "ALL"
                        ? "Tous les utilisateurs"
                        : selectedPromo.eligibilityMode}
                  </div>
                </div>
                {selectedPromo.eligibleRole && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Rôle éligible
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPromo.eligibleRole}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Utilisateurs max
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedPromo.maxUsers?.toLocaleString() || "Illimité"}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Contraintes spécifiques */}
            {selectedPromo.constraints && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Contraintes spécifiques
                </h4>
                <div className="space-y-4">
                  {selectedPromo.constraints.maxDiscount && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Remise maximale
                      </label>
                      <div className="text-sm text-gray-900">
                        {formatPromoType(
                          selectedPromo.type,
                          selectedPromo.constraints.maxDiscount,
                        )}
                      </div>
                    </div>
                  )}
                  {selectedPromo.constraints.firstTimeOnly && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Réservé aux nouveaux clients
                      </label>
                      <div className="text-sm text-gray-900">Oui</div>
                    </div>
                  )}
                  {selectedPromo.constraints.applicableServices &&
                    selectedPromo.constraints.applicableServices.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Services applicables
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedPromo.constraints.applicableServices.map(
                            (service) => (
                              <span
                                key={service}
                                className="px-2 py-1 text-xs bg-white rounded-full border border-gray-300"
                              >
                                {service}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Section 6: Utilisateurs assignés */}
            {selectedPromo.hasAssignedUsers && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Utilisateurs assignés
                  </div>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {selectedPromo.assignedUsersCount} utilisateur
                    {selectedPromo.assignedUsersCount > 1 ? "s" : ""}
                  </span>
                </h4>
                <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Téléphone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {selectedPromo.assignedUsers &&
                      selectedPromo.assignedUsers.length > 0 ? (
                        selectedPromo.assignedUsers.map((user) => (
                          <tr key={user.userId} className="hover:bg-blue-50/50">
                            <td className="px-4 py-2 font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {user.email || "-"}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {user.phoneNumber || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-8 text-center text-gray-500 italic"
                          >
                            Chargement des utilisateurs...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 7: Associations & Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Associations
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Entreprise
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPromo.companyId || "Non associée"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Campagne
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPromo.campaignId || "Non associée"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Utilisateur principal assigné
                    </label>
                    <div className="text-sm text-gray-900">
                      {selectedPromo.assignedUserId || "Non assigné"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Métadonnées
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Dernière mise à jour
                    </label>
                    <div className="text-sm text-gray-900">
                      {formatDate(selectedPromo.updatedAt)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Créé le
                    </label>
                    <div className="text-sm text-gray-900">
                      {formatDate(selectedPromo.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page fixe */}
        <div className="p-6 border-t border-gray-200 shrink-0">
          <button
            onClick={closeDetailsModal}
            className="cursor-pointer w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
