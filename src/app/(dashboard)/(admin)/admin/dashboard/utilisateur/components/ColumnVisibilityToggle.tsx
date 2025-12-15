// app/(dashboard)/utilisateur/components/ColumnVisibilityToggle.tsx
import { Check, X } from "lucide-react";

export interface DefaultVisibleColumnsInterface {
  name: boolean;
  email: boolean;
  phoneNumber: boolean;
  countryCode: boolean;
  genderrole: boolean;
  role: boolean;
  isArchived: boolean;
  createdAt: boolean;
  actions: boolean;
}

export type ColumnKey = keyof DefaultVisibleColumnsInterface;

interface ColumnVisibilityToggleProps {
  visibleColumns: DefaultVisibleColumnsInterface;
  onToggleColumn: (column: ColumnKey) => void;
  onReset: () => void;
}

const columnLabels: Record<ColumnKey, string> = {
  name: "Nom",
  email: "Email",
  phoneNumber: "Téléphone",
  countryCode: "Code pays",
  genderrole: "Genre",
  role: "Rôle",
  isArchived: "Statut archivé",
  createdAt: "Date d'inscription",
  actions: "Actions",
};

export default function ColumnVisibilityToggle({
  visibleColumns,
  onToggleColumn,
  onReset,
}: ColumnVisibilityToggleProps) {
  // Liste des colonnes avec leur type correct
  const columns: ColumnKey[] = [
    "name",
    "email",
    "phoneNumber",
    "countryCode",
    "genderrole",
    "role",
    "isArchived",
    "createdAt",
    "actions",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Visibilité des colonnes
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-[#FD481A] hover:text-[#E63F15] transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {columns.map((column) => (
          <button
            key={column}
            onClick={() => onToggleColumn(column)}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              visibleColumns[column]
                ? "border-[#FD481A] bg-orange-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <span className="text-sm font-medium text-gray-700">
              {columnLabels[column]}
            </span>
            {visibleColumns[column] ? (
              <Check className="w-4 h-4 text-[#FD481A]" />
            ) : (
              <X className="w-4 h-4 text-gray-400" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {Object.values(visibleColumns).filter(Boolean).length} colonne(s)
          visible(s) sur {columns.length}
        </p>
      </div>
    </div>
  );
}

// // app/(dashboard)/utilisateur/components/ColumnVisibilityToggle.tsx
// import { Check, X } from "lucide-react";
// import { DefaultVisibleColumnsInterface } from "../page";

// interface ColumnVisibilityToggleProps {
//   visibleColumns: DefaultVisibleColumnsInterface;
//   onToggleColumn: (column: string) => void;
//   onReset: () => void;
// }

// const columnLabels: Record<
//   keyof ColumnVisibilityToggleProps["visibleColumns"],
//   string
// > = {
//   name: "Nom",
//   email: "Email",
//   phoneNumber: "Téléphone",
//   countryCode: "Code pays",
//   genderrole: "Genre",
//   role: "Rôle",
//   isArchived: "Statut archivé",
//   createdAt: "Date d'inscription",
//   actions: "Actions",
// };

// export default function ColumnVisibilityToggle({
//   visibleColumns,
//   onToggleColumn,
//   onReset,
// }: ColumnVisibilityToggleProps) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Visibilité des colonnes
//         </h3>
//         <button
//           onClick={onReset}
//           className="text-sm text-[#FD481A] hover:text-[#E63F15] transition-colors"
//         >
//           Réinitialiser
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//         {(
//           Object.keys(visibleColumns) as Array<keyof typeof visibleColumns>
//         ).map((column) => (
//           <button
//             key={column}
//             onClick={() => onToggleColumn(column)}
//             className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
//               visibleColumns[column]
//                 ? "border-[#FD481A] bg-orange-50"
//                 : "border-gray-300 hover:border-gray-400"
//             }`}
//           >
//             <span className="text-sm font-medium text-gray-700">
//               {columnLabels[column]}
//             </span>
//             {visibleColumns[column] ? (
//               <Check className="w-4 h-4 text-[#FD481A]" />
//             ) : (
//               <X className="w-4 h-4 text-gray-400" />
//             )}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4 pt-4 border-t border-gray-200">
//         <p className="text-sm text-gray-500">
//           {Object.values(visibleColumns).filter(Boolean).length} colonne(s)
//           visible(s) sur {Object.keys(visibleColumns).length}
//         </p>
//       </div>
//     </div>
//   );
// }
