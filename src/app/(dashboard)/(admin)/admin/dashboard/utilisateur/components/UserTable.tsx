// app/(dashboard)/utilisateur/components/UserTable.tsx
"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  Globe,
  Archive,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { User } from "@/type/user.type";
import { GrantedRole } from "@/type/enum";
import { useUsersManagement } from "@/hooks/use-users-management";
import { ColumnKey } from "./ColumnVisibilityToggle";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  visibleColumns: Record<ColumnKey, boolean>;
  isAdmin: boolean;
  getRoleLabel: (role: GrantedRole) => string;
  getGenderLabel: (gender: string) => string;
  formatDate: (dateString: string) => string;
}

export default function UserTable({
  users,
  isLoading,
  visibleColumns,
  isAdmin,
  getRoleLabel,
  getGenderLabel,
  formatDate,
}: UserTableProps) {
  const { openPromotionModal } = useUsersManagement();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (userId: string) => {
    setExpandedCard(expandedCard === userId ? null : userId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A] mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <UserIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Aucun utilisateur trouvé
        </h3>
        <p className="text-gray-500 mt-1">
          Ajustez vos filtres pour voir plus de résultats
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Version Tableau pour écrans lg et plus grands */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {visibleColumns.name && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Nom
                  </div>
                </th>
              )}
              {visibleColumns.email && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </th>
              )}
              {visibleColumns.phoneNumber && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </div>
                </th>
              )}
              {visibleColumns.countryCode && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Code pays
                  </div>
                </th>
              )}
              {visibleColumns.genderrole && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
              )}
              {visibleColumns.role && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Rôle
                  </div>
                </th>
              )}
              {visibleColumns.isArchived && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Statut
                  </div>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Inscription
                  </div>
                </th>
              )}
              {visibleColumns.actions && isAdmin && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user._id}
                className={`hover:bg-gray-50 transition-colors ${
                  user.isArchived ? "bg-gray-50" : ""
                }`}
              >
                {visibleColumns.name && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns.email && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                )}
                {visibleColumns.phoneNumber && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.phoneNumber}
                    </div>
                  </td>
                )}
                {visibleColumns.countryCode && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {user.countryCode}
                    </div>
                  </td>
                )}
                {visibleColumns.genderrole && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {getGenderLabel(user.genderrole)}
                    </span>
                  </td>
                )}
                {visibleColumns.role && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.role === GrantedRole.Admin
                          ? "bg-purple-100 text-purple-800"
                          : user.role === GrantedRole.Livreur
                          ? "bg-green-100 text-green-800"
                          : user.role === GrantedRole.Operateur
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                )}
                {visibleColumns.isArchived && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isArchived ? (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                        <Archive className="w-3 h-3 inline mr-1" />
                        Archivé
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    )}
                  </td>
                )}
                {visibleColumns.createdAt && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                )}
                {visibleColumns.actions && isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.role !== GrantedRole.Admin && (
                      <button
                        onClick={() => openPromotionModal(user)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                        title="Changer le rôle"
                      >
                        <Shield className="w-4 h-4" />
                        Modifier rôle
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Cartes pour écrans md et plus petits */}
      <div className="lg:hidden space-y-4 p-4">
        {users.map((user) => (
          <div
            key={user._id}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all ${
              user.isArchived ? "opacity-80" : ""
            }`}
          >
            {/* En-tête de la carte */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCard(user._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === GrantedRole.Admin
                            ? "bg-purple-100 text-purple-800"
                            : user.role === GrantedRole.Livreur
                            ? "bg-green-100 text-green-800"
                            : user.role === GrantedRole.Operateur
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                      {user.isArchived && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                          <Archive className="w-3 h-3 inline mr-1" />
                          Archivé
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {expandedCard === user._id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Informations basiques toujours visibles */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {visibleColumns.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {user.email}
                    </span>
                  </div>
                )}
                {visibleColumns.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {user.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contenu dépliable */}
            {expandedCard === user._id && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Informations détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleColumns.countryCode && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <Globe className="w-3 h-3 inline mr-1" />
                        Code pays
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {user.countryCode}
                      </div>
                    </div>
                  )}
                  {visibleColumns.genderrole && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Genre
                      </label>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getGenderLabel(user.genderrole)}
                      </span>
                    </div>
                  )}
                  {visibleColumns.createdAt && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Inscription
                      </label>
                      <div className="text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ID utilisateur
                    </label>
                    <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded">
                      {user._id}
                    </div>
                  </div>
                </div>

                {/* Bouton d'action */}
                {visibleColumns.actions &&
                  isAdmin &&
                  user.role !== GrantedRole.Admin && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => openPromotionModal(user)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Modifier le rôle de cet utilisateur
                      </button>
                    </div>
                  )}
              </div>
            )}

            {/* Bouton d'action visible même quand la carte n'est pas dépliée */}
            {!expandedCard &&
              visibleColumns.actions &&
              isAdmin &&
              user.role !== GrantedRole.Admin && (
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={() => openPromotionModal(user)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#FD481A] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Modifier rôle
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </>
  );
}
