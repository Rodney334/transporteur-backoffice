import { UseFormReturn } from "react-hook-form";

interface MoreDataProps {
  form: UseFormReturn<any>;
}

export const MoreData = ({ form }: MoreDataProps) => {
  return (
    <div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Récapitulatif de la commande
          </h2>

          <div className="space-y-6">
            {/* Informations de base */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations de la course
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type de service</p>
                  <p className="font-medium">{form.watch("serviceType")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type de livraison</p>
                  <p className="font-medium">{form.watch("deliveryType")}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-600">Zone</p>
                  <p className="font-medium">{form.watch("zone")}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-600">Poids</p>
                  <p className="font-medium">{form.watch("weight")} kg</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{form.watch("description")}</p>
                </div>
              </div>
            </div>

            {/* Adresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Adresse de pickup
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Nom:</strong> {form.watch("pickupName")}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {form.watch("pickupPhone")}
                  </p>
                  <p>
                    <strong>Adresse:</strong> {form.watch("pickupStreet")},{" "}
                    {form.watch("pickupDistrict")}
                  </p>
                  <p>
                    <strong>Ville:</strong> {form.watch("pickupCity")},{" "}
                    {form.watch("pickupCountry")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Adresse de livraison
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Nom:</strong> {form.watch("deliveryName")}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {form.watch("deliveryPhone")}
                  </p>
                  <p>
                    <strong>Adresse:</strong> {form.watch("deliveryStreet")},{" "}
                    {form.watch("deliveryDistrict")}
                  </p>
                  <p>
                    <strong>Ville:</strong> {form.watch("deliveryCity")},{" "}
                    {form.watch("deliveryCountry")}
                  </p>
                </div>
              </div>
            </div>

            {/* Prix */}
            {/* <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Total</h3>
                <div className="text-2xl font-bold text-[#FD481A]">
                  {form.watch("estimatedPrice").toLocaleString()} FCFA
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Informations Lieu de Départ */}
      {/* <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
          Informations Lieu de Départ
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 lg:mb-3">
              Contact Envoyeur
            </h3>
            <div className="space-y-1 lg:space-y-2 text-xs text-gray-600">
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 lg:mb-3">
              Details Colis
            </h3>
            <div className="space-y-1 lg:space-y-2 text-xs text-gray-600">
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Informations Lieu d'Arrivée */}
      {/* <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mt-4 lg:mt-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
          Informations Lieu d'Arrivée
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 lg:mb-3">
              Contact Envoyeur
            </h3>
            <div className="space-y-1 lg:space-y-2 text-xs text-gray-600">
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 lg:mb-3">
              Details Colis
            </h3>
            <div className="space-y-1 lg:space-y-2 text-xs text-gray-600">
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
              <p>Graduation Date : Your CDIM - Location</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
