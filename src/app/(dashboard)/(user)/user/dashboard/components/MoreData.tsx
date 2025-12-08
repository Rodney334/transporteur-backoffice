import { UseFormReturn } from "react-hook-form";

interface MoreDataProps {
  form: UseFormReturn<any>;
}

export const MoreData = ({ form }: MoreDataProps) => {
  return (
    <div className="space-y-6">
      {/* Carte principale - Récapitulatif */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* En-tête avec couleur principale */}
        <div className="bg-[#FD481A] px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            Récapitulatif de la commande
          </h2>
        </div>

        <div className="p-6">
          {/* Section Informations de la course */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-[#FD481A] rounded-full"></div>
              <h3 className="text-lg font-semibold text-[#131313]">
                Informations de la course
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-medium text-[#333333]">
                    Type de service
                  </span>
                  <span className="text-sm font-semibold text-[#131313]">
                    {form.watch("serviceType")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-medium text-[#333333]">
                    Poids
                  </span>
                  <span className="text-sm font-semibold text-[#131313]">
                    {form.watch("weight")} kg
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-medium text-[#333333]">
                    Type de livraison
                  </span>
                  <span className="text-sm font-semibold text-[#131313]">
                    {form.watch("deliveryType")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-[#333333]">
                    Description
                  </span>
                  <span className="text-sm font-semibold text-[#131313] text-right max-w-[150px] truncate">
                    {form.watch("description")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid des adresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carte Adresse de pickup */}
            <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FD481A] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#131313]">
                  Adresse de pickup
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Nom:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("pickupName")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Téléphone:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("pickupPhone")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Adresse:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("pickupStreet")}, {form.watch("pickupDistrict")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Ville:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("pickupCity")}, {form.watch("pickupCountry")}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Adresse de livraison */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#FD481A] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#131313]">
                  Adresse de livraison
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Nom:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("deliveryName")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Téléphone:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("deliveryPhone")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Adresse:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("deliveryStreet")},{" "}
                    {form.watch("deliveryDistrict")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#333333] min-w-20">
                    Ville:
                  </span>
                  <span className="text-sm text-[#131313] text-right flex-1">
                    {form.watch("deliveryCity")},{" "}
                    {form.watch("deliveryCountry")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Description complète (optionnel - si besoin de plus d'espace) */}
      {form.watch("description") && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-6 bg-[#FD481A] rounded-full"></div>
            <h3 className="text-lg font-semibold text-[#131313]">
              Description complète
            </h3>
          </div>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
            {form.watch("description")}
          </p>
        </div>
      )}
    </div>
  );
};
