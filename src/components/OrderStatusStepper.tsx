// components/OrderStatusStepper.tsx
import { OrderStatus, STATUS_FLOW } from "@/type/enum";
import {
    Clock,
    UserCheck,
    MessageSquare,
    CheckCircle,
    Truck,
    PackageCheck,
    LucideIcon,
} from "lucide-react";

interface OrderStatusStepperProps {
    currentStatus: OrderStatus;
}

interface StatusConfig {
    status: OrderStatus;
    icon: LucideIcon;
    label: string;
}

const STATUS_CONFIG: StatusConfig[] = [
    {
        status: OrderStatus.EN_ATTENTE,
        icon: Clock,
        label: "En attente",
    },
    {
        status: OrderStatus.ASSIGNEE,
        icon: UserCheck,
        label: "Assignée",
    },
    {
        status: OrderStatus.EN_DISCUSSION,
        icon: MessageSquare,
        label: "En discussion",
    },
    {
        status: OrderStatus.PRIX_VALIDE,
        icon: CheckCircle,
        label: "Prix validé",
    },
    {
        status: OrderStatus.EN_LIVRAISON,
        icon: Truck,
        label: "En livraison",
    },
    {
        status: OrderStatus.LIVREE,
        icon: PackageCheck,
        label: "Livrée",
    },
];

export const OrderStatusStepper = ({
    currentStatus,
}: OrderStatusStepperProps) => {
    // Trouver l'index du statut actuel
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);

    // Fonction pour déterminer l'état d'une étape
    const getStepState = (index: number): "completed" | "current" | "future" => {
        if (index < currentIndex) return "completed";
        if (index === currentIndex) return "current";
        return "future";
    };

    // Fonction pour obtenir les couleurs selon l'état
    const getStepColors = (state: "completed" | "current" | "future") => {
        switch (state) {
            case "completed":
                return {
                    circle: "bg-[#FD481A] border-[#FD481A]",
                    icon: "text-white",
                    line: "bg-[#FD481A]",
                };
            case "current":
                return {
                    circle: "bg-[#131313] border-[#131313]",
                    icon: "text-white",
                    line: "bg-[#333333]",
                };
            case "future":
                return {
                    circle: "bg-white border-[#333333]",
                    icon: "text-[#333333]",
                    line: "bg-[#333333]",
                };
        }
    };

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between">
                {STATUS_CONFIG.map((config, index) => {
                    const state = getStepState(index);
                    const colors = getStepColors(state);
                    const Icon = config.icon;
                    const isLast = index === STATUS_CONFIG.length - 1;

                    return (
                        <div key={config.status} className="flex items-center flex-1">
                            {/* Cercle avec icône */}
                            <div className="relative group shrink-0">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${colors.circle}`}
                                >
                                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                                </div>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {config.label}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>

                            {/* Ligne de connexion */}
                            {!isLast && (
                                <div className="flex-1 mx-1">
                                    <div className={`h-0.5 ${colors.line} transition-all`}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
