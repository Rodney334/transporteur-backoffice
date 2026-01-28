
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { AlertsSchema } from "@/type/report.type";

interface AlertsListProps {
    alerts: AlertsSchema;
}

export const AlertsList = ({ alerts }: AlertsListProps) => {
    if (!alerts || alerts.alerts.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center h-full">
                <CheckCircle className="w-12 h-12 text-green-100 bg-green-50 rounded-full p-2 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Aucune Alerte</h3>
                <p className="text-gray-500 text-sm">Tout semble normal pour cette période.</p>
            </div>
        );
    }

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "DELIVERED_NOT_PAID":
                return <AlertTriangle className="w-5 h-5 text-orange-600" />;
            case "UNASSIGNED_ORDER":
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case "DELIVERED_NOT_PAID":
                return "bg-orange-50 border-orange-100 text-orange-800";
            case "UNASSIGNED_ORDER":
                return "bg-red-50 border-red-100 text-red-800";
            default:
                return "bg-blue-50 border-blue-100 text-blue-800";
        }
    };

    const getAlertMessage = (alert: any) => {
        switch (alert.type) {
            case "DELIVERED_NOT_PAID":
                return `Commande livrée mais non payée (${alert.details?.paymentAmount} FCFA)`;
            case "UNASSIGNED_ORDER":
                return "Commande non assignée depuis un moment";
            default:
                return `Alerte: ${alert.type}`;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-gray-900">Alertes ({alerts.count})</h3>
                </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {alerts.alerts.map((alert, index) => (
                    <div key={index} className={`p-4 hover:bg-gray-50 transition-colors ${getAlertColor(alert.type)} border-l-4 border-l-transparent`}>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">
                                    {getAlertMessage(alert)}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                                    <span className="font-mono bg-white/50 px-1 rounded">#{alert.orderId.substring(0, 8)}</span>
                                    <span>•</span>
                                    <span>{new Date(alert.at).toLocaleString("fr-FR")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
