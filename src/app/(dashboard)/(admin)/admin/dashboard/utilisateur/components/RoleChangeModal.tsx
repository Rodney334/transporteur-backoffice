// app/(dashboard)/utilisateur/components/RoleChangeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { toast } from "react-toastify";
import { useUsersStore } from "@/lib/stores/users-store";
import { userService } from "@/lib/services/user-service";
import { GrantedRole } from "@/type/enum";

export default function RoleChangeModal() {
  const {
    selectedUser,
    setSelectedUser,
    promoteUser: updateUserInStore,
  } = useUsersStore();
  const [selectedRole, setSelectedRole] = useState<GrantedRole>(
    GrantedRole.User
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le rôle sélectionné quand un utilisateur est sélectionné
  useEffect(() => {
    if (selectedUser) {
      setSelectedRole(selectedUser.role);
    }
  }, [selectedUser]);

  const roleOptions = [
    {
      value: GrantedRole.Admin,
      label: "Administrateur",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: GrantedRole.Livreur,
      label: "Livreur",
      color: "bg-green-100 text-green-800",
    },
    {
      value: GrantedRole.Operateur,
      label: "Opérateur",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: GrantedRole.Client,
      label: "Client",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: GrantedRole.User,
      label: "Utilisateur",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedUser(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser || selectedRole === selectedUser.role) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Changement de rôle en cours...", {
      position: "top-left",
    });

    try {
      // Appel API
      await userService.promoteUser(selectedUser._id, selectedRole);

      // Mise à jour du store local
      updateUserInStore(selectedUser._id, selectedRole);

      toast.update(toastId, {
        render: `Rôle de ${selectedUser.name} mis à jour avec succès !`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      // Fermer le modal après succès
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Erreur changement de rôle:", error);
      const errorMessage =
        error.response?.data?.message || "Erreur lors du changement de rôle";

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 7000,
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* En-tête fixe */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Shield className="w-6 h-6 text-[#FD481A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Changer le rôle
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Modification des permissions
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Informations utilisateur */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedUser.name}
                  </h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-gray-500">
                      Rôle actuel :
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        roleOptions.find((r) => r.value === selectedUser.role)
                          ?.color || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {
                        roleOptions.find((r) => r.value === selectedUser.role)
                          ?.label
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sélectionnez le nouveau rôle
              </label>
              <div className="space-y-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      selectedRole === option.value
                        ? "border-[#FD481A] bg-orange-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedRole === option.value
                            ? "bg-[#FD481A]"
                            : "border border-gray-300"
                        }`}
                      />
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${option.color}`}
                    >
                      {option.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avertissement pour le rôle Admin */}
            {selectedRole === GrantedRole.Admin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Attention :</strong> L'administrateur a accès à
                      toutes les fonctionnalités du système.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pied de page fixe */}
        <div className="p-6 border-t border-gray-200 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedRole === selectedUser.role}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Modification...
                </span>
              ) : (
                "Confirmer le changement"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// // app/(dashboard)/utilisateur/components/RoleChangeModal.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Shield, X } from "lucide-react";
// import { toast } from "react-toastify";
// import { useUsersStore } from "@/lib/stores/users-store";
// import { userService } from "@/lib/services/user-service";
// import { GrantedRole } from "@/type/enum";

// export default function RoleChangeModal() {
//   const {
//     selectedUser,
//     setSelectedUser,
//     promoteUser: updateUserInStore,
//   } = useUsersStore();
//   const [selectedRole, setSelectedRole] = useState<GrantedRole>(
//     GrantedRole.User
//   );
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Initialiser le rôle sélectionné quand un utilisateur est sélectionné
//   useEffect(() => {
//     if (selectedUser) {
//       setSelectedRole(selectedUser.role);
//     }
//   }, [selectedUser]);

//   const roleOptions = [
//     {
//       value: GrantedRole.Admin,
//       label: "Administrateur",
//       color: "bg-purple-100 text-purple-800",
//     },
//     {
//       value: GrantedRole.Livreur,
//       label: "Livreur",
//       color: "bg-green-100 text-green-800",
//     },
//     {
//       value: GrantedRole.Operateur,
//       label: "Opérateur",
//       color: "bg-yellow-100 text-yellow-800",
//     },
//     {
//       value: GrantedRole.Client,
//       label: "Client",
//       color: "bg-blue-100 text-blue-800",
//     },
//     {
//       value: GrantedRole.User,
//       label: "Utilisateur",
//       color: "bg-gray-100 text-gray-800",
//     },
//   ];

//   const handleClose = () => {
//     if (!isSubmitting) {
//       setSelectedUser(null);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedUser || selectedRole === selectedUser.role) return;

//     setIsSubmitting(true);
//     const toastId = toast.loading("Changement de rôle en cours...", {
//       position: "top-left",
//     });

//     try {
//       // Appel API
//       await userService.promoteUser(selectedUser._id, selectedRole);

//       // Mise à jour du store local
//       updateUserInStore(selectedUser._id, selectedRole);

//       toast.update(toastId, {
//         render: `Rôle de ${selectedUser.name} mis à jour avec succès !`,
//         type: "success",
//         isLoading: false,
//         autoClose: 5000,
//         closeButton: true,
//       });

//       // Fermer le modal après succès
//       setSelectedUser(null);
//     } catch (error: any) {
//       console.error("Erreur changement de rôle:", error);
//       const errorMessage =
//         error.response?.data?.message || "Erreur lors du changement de rôle";

//       toast.update(toastId, {
//         render: errorMessage,
//         type: "error",
//         isLoading: false,
//         autoClose: 7000,
//         closeButton: true,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!selectedUser) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//         {/* En-tête */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-orange-50 rounded-lg">
//                 <Shield className="w-6 h-6 text-[#FD481A]" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">
//                   Changer le rôle
//                 </h3>
//                 <p className="text-gray-500 text-sm mt-1">
//                   Modification des permissions
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleClose}
//               className="text-gray-400 hover:text-gray-500 transition-colors"
//               disabled={isSubmitting}
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Contenu */}
//         <div className="p-6 space-y-6">
//           {/* Informations utilisateur */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <div className="flex items-center gap-3">
//               <div className="shrink-0 h-12 w-12 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center">
//                 <span className="text-white font-medium text-lg">
//                   {selectedUser.name.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">
//                   {selectedUser.name}
//                 </h4>
//                 <p className="text-sm text-gray-500">{selectedUser.email}</p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-xs font-medium text-gray-500">
//                     Rôle actuel :
//                   </span>
//                   <span
//                     className={`text-xs px-2 py-1 rounded-full ${
//                       roleOptions.find((r) => r.value === selectedUser.role)
//                         ?.color || "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {
//                       roleOptions.find((r) => r.value === selectedUser.role)
//                         ?.label
//                     }
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sélecteur de rôle */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Sélectionnez le nouveau rôle
//             </label>
//             <div className="space-y-2">
//               {roleOptions.map((option) => (
//                 <button
//                   key={option.value}
//                   type="button"
//                   onClick={() => setSelectedRole(option.value)}
//                   className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
//                     selectedRole === option.value
//                       ? "border-[#FD481A] bg-orange-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`w-3 h-3 rounded-full ${
//                         selectedRole === option.value
//                           ? "bg-[#FD481A]"
//                           : "border border-gray-300"
//                       }`}
//                     />
//                     <span className="font-medium text-gray-900">
//                       {option.label}
//                     </span>
//                   </div>
//                   <span
//                     className={`text-xs px-2 py-1 rounded-full ${option.color}`}
//                   >
//                     {option.value}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Avertissement pour le rôle Admin */}
//           {selectedRole === GrantedRole.Admin && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <div className="flex items-start">
//                 <svg
//                   className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>
//                   <p className="text-sm text-yellow-800">
//                     <strong>Attention :</strong> L'administrateur a accès à
//                     toutes les fonctionnalités du système.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Pied de page */}
//         <div className="p-6 border-t border-gray-200">
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Annuler
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={isSubmitting || selectedRole === selectedUser.role}
//               className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#FD481A] hover:bg-[#E63F15] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Modification...
//                 </span>
//               ) : (
//                 "Confirmer le changement"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
