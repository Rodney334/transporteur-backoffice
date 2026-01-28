
import { DollarSign, Package, TrendingUp, CheckCircle, AlertTriangle, CreditCard, Clock } from "lucide-react";
import { KPISchema } from "@/type/report.type";

interface KPIsCardsProps {
    kpis: KPISchema;
}

export const KPIsCards = ({ kpis }: KPIsCardsProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const cards = [
        {
            title: "Revenus Livrés",
            value: formatCurrency(kpis.revenueDelivered),
            icon: <DollarSign className="w-6 h-6 text-green-600" />,
            color: "bg-green-100",
            description: "Montant total livré",
        },
        {
            title: "Revenus Payés",
            value: formatCurrency(kpis.revenuePaid),
            icon: <CreditCard className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-100",
            description: "Montant encaissé",
        },
        {
            title: "En Attente Paiement",
            value: formatCurrency(kpis.revenuePending),
            icon: <Clock className="w-6 h-6 text-orange-600" />,
            color: "bg-orange-100",
            description: "Livré mais non payé",
        },
        {
            title: "Revenus Échoués",
            value: formatCurrency(kpis.revenueFailed),
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            color: "bg-red-100",
            description: "Montant non livré",
        },
        {
            title: "Commandes Totales",
            value: kpis.ordersTotal,
            icon: <Package className="w-6 h-6 text-indigo-600" />,
            color: "bg-indigo-100",
            description: "Total des commandes",
        },
        {
            title: "Livrées",
            value: kpis.delivered,
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
            color: "bg-emerald-100",
            description: `${kpis.successRate}% de réussite`,
        },
        {
            title: "Échecs",
            value: kpis.failed,
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            color: "bg-red-100",
            description: "Commandes échouées",
        },
        {
            title: "Non Payées (Nb)",
            value: kpis.deliveredNotPaidCount,
            icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
            color: "bg-yellow-100",
            description: formatCurrency(kpis.deliveredNotPaidAmount),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                        <div className={`p-2 rounded-full ${card.color}`}>{card.icon}</div>
                    </div>
                    <div className="mb-2">
                        <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                        <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
