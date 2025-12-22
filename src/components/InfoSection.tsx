import { OrderStatus } from "@/type/enum";
import {
  ContactCourseInterface,
  DetailCourseInterface,
} from "@/app/(dashboard)/(admin)/admin/dashboard/commande/components/OrdersManager.types";

interface InfoSectionProps {
  title: string;
  data: ContactCourseInterface | null;
}

interface InfoColisProps {
  title: string;
  data: DetailCourseInterface | null;
}

export const InfoSection = ({ title, data }: InfoSectionProps) => {
  if (!data) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Sélectionnez une commande pour voir les détails
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Nom :</span>
          <span className="text-gray-800 text-right flex-1">{data.nom}</span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Tel :</span>
          <span className="text-gray-800 text-right flex-1">
            {data.telephone}
          </span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Pays :</span>
          <span className="text-gray-800 text-right flex-1">{data.pays}</span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Ville :</span>
          <span className="text-gray-800 text-right flex-1">{data.ville}</span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Quartier :</span>
          <span className="text-gray-800 text-right flex-1">
            {data.quartier}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-600 min-w-20">Rue :</span>
          <span className="text-gray-800 text-right flex-1">{data.rue}</span>
        </div>
      </div>
    </div>
  );
};

export const InfoColisSection = ({ title, data }: InfoColisProps) => {
  if (!data) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Sélectionnez une commande pour voir les détails
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-linear-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Service :</span>
          <span className="text-gray-800 text-right flex-1 capitalize">
            {data.serviceType}
          </span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Article :</span>
          <span className="text-gray-800 text-right flex-1 capitalize">
            {data.articleType}
          </span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">
            Transport :
          </span>
          <span className="text-gray-800 text-right flex-1 capitalize">
            {data.transportMode}
          </span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">
            Livraison :
          </span>
          <span className="text-gray-800 text-right flex-1 capitalize">
            {data.deliveryType}
          </span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-100 last:border-b-0">
          <span className="font-medium text-gray-600 min-w-20">Poids :</span>
          <span className="text-gray-800 text-right flex-1">{data.weight}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-600 min-w-20">Statut :</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
              data.status === OrderStatus.LIVREE
                ? "bg-green-100 text-green-800"
                : data.status === OrderStatus.EN_LIVRAISON ||
                  data.status === OrderStatus.ASSIGNEE ||
                  data.status === OrderStatus.EN_DISCUSSION ||
                  data.status === OrderStatus.PRIX_VALIDE
                ? "bg-blue-100 text-blue-800"
                : data.status === OrderStatus.EN_ATTENTE
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>
    </div>
  );
};
