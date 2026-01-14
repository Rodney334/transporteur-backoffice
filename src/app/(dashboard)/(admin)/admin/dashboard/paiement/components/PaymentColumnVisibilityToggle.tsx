import { Check, X } from "lucide-react";

export interface DefaultVisibleColumnsInterface {
  client: boolean;
  deliverer: boolean;
  amount: boolean;
  method: boolean;
  status: boolean;
  date: boolean;
  orderId: boolean;
}

export type ColumnKey = keyof DefaultVisibleColumnsInterface;

interface PaymentColumnVisibilityToggleProps {
  visibleColumns: DefaultVisibleColumnsInterface;
  onToggleColumn: (column: ColumnKey) => void;
  onReset: () => void;
}

const columnLabels: Record<ColumnKey, string> = {
  client: "Client",
  deliverer: "Livreur",
  amount: "Montant",
  method: "Méthode",
  status: "Statut",
  date: "Date",
  orderId: "Commande",
};

export default function PaymentColumnVisibilityToggle({
  visibleColumns,
  onToggleColumn,
  onReset,
}: PaymentColumnVisibilityToggleProps) {
  const columns: ColumnKey[] = [
    "client",
    "deliverer",
    "amount",
    "method",
    "status",
    "date",
    "orderId",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Visibilité des colonnes
        </h3>
        <button
          onClick={onReset}
          className="cursor-pointer text-sm text-[#FD481A] hover:text-[#E63F15] transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {columns.map((column) => (
          <button
            key={column}
            onClick={() => onToggleColumn(column)}
            className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-colors ${
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
