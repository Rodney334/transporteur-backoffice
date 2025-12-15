// app/(dashboard)/utilisateur/components/UserTable.tsx
import {
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  Globe,
  Archive,
  Calendar,
} from "lucide-react";
import { User } from "@/type/user.type";
import { GrantedRole } from "@/type/enum";
import { useUsersManagement } from "@/hooks/use-users-management";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  visibleColumns: {
    name: boolean;
    email: boolean;
    phoneNumber: boolean;
    countryCode: boolean;
    genderrole: boolean;
    role: boolean;
    isArchived: boolean;
    createdAt: boolean;
    actions: boolean;
  };
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
    <div className="overflow-x-auto">
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
  );
}
