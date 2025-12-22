// app/(dashboard)/utilisateur/components/DeliveryColumnVisibilityToggle.tsx
import { Check, X } from "lucide-react";

export interface DefaultVisibleColumnsInterface {
  clientName: boolean;
  pickupAddress: boolean;
  deliveryAddress: boolean;
  deliveryType: boolean;
  finalPrice: boolean;
  status: boolean;
  createdAt: boolean;
}

export type ColumnKey = keyof DefaultVisibleColumnsInterface;

interface DeliveryColumnVisibilityToggleProps {
  visibleColumns: DefaultVisibleColumnsInterface;
  onToggleColumn: (column: ColumnKey) => void;
  onReset: () => void;
}

const columnLabels: Record<ColumnKey, string> = {
  clientName: "Client",
  pickupAddress: "Départ",
  deliveryAddress: "Arrivée",
  deliveryType: "Type",
  finalPrice: "Prix final",
  status: "Statut",
  createdAt: "Date",
};

export default function DeliveryColumnVisibilityToggle({
  visibleColumns,
  onToggleColumn,
  onReset,
}: DeliveryColumnVisibilityToggleProps) {
  // Liste des colonnes avec leur type correct
  const columns: ColumnKey[] = [
    "clientName",
    "pickupAddress",
    "deliveryAddress",
    "deliveryType",
    "finalPrice",
    "status",
    "createdAt",
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
