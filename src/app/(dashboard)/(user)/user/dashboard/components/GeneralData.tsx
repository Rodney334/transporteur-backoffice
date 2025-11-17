// components/DimensionData.tsx
import { UseFormReturn } from "react-hook-form";

interface GeneralDataProps {
  form: UseFormReturn<any>;
}

export const GeneralData = ({ form }: GeneralDataProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Départ */}
      <div>
        <div className="flex items-center gap-2 mb-3 lg:mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-700">
            Où le colis sera-t-il récupéré ?
          </h3>
        </div>

        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 lg:mb-3">
              Details Contact
            </h4>
            <div className="mt-2 lg:mt-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Nom"
                  // {...register("lastName", { required: "Le nom est requis." })}
                  value={form.watch("pickupName")}
                  onChange={(e) => {
                    form.setValue("pickupName", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mt-2 lg:mt-3">
              <label className="block text-xs text-gray-600 mb-1">
                Téléphone (indicatif + numéro : +229 0197979797)
              </label>
              <div className="flex gap-2">
                {/* <select className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]">
                  <option>+ 91</option>
                </select> */}
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Numéro de téléphone"
                  value={form.watch("pickupPhone")}
                  onChange={(e) => {
                    form.setValue("pickupPhone", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 lg:mb-3">
              Details Lieu de Départ
            </h4>
            <div className="space-y-2 lg:space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pays</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Pays"
                  value={form.watch("pickupCountry")}
                  onChange={(e) => {
                    form.setValue("pickupCountry", e.target.value);
                  }}
                />
              </div>
              <div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    placeholder="Ville"
                    value={form.watch("pickupCity")}
                    onChange={(e) => {
                      form.setValue("pickupCity", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Commune / Arrondissement
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Commune et/ou Arrondissement"
                  value={form.watch("pickupDistrict")}
                  onChange={(e) => {
                    form.setValue("pickupDistrict", e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Informations supplémentaires (Monument célèbre)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Informations supplémentaires"
                  value={form.watch("pickupStreet")}
                  onChange={(e) => {
                    form.setValue("pickupStreet", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrivée */}
      <div>
        <div className="flex items-center gap-2 mb-3 lg:mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-700">
            Où est envoyé le colis ?
          </h3>
        </div>

        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
          {/* Même structure que pour Départ */}
          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 lg:mb-3">
              Details Contact
            </h4>
            <div className="mt-2 lg:mt-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Nom et prénom"
                  value={form.watch("deliveryName")}
                  onChange={(e) => {
                    form.setValue("deliveryName", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mt-2 lg:mt-3">
              <label className="block text-xs text-gray-600 mb-1">
                Téléphone (indicatif + numéro : +229 0197979797)
              </label>
              <div className="flex gap-2">
                {/* <select className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]">
                  <option>+ 91</option>
                </select> */}
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Numéro de téléphone"
                  value={form.watch("deliveryPhone")}
                  onChange={(e) => {
                    form.setValue("deliveryPhone", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 lg:mb-3">
              Details Lieu d'arrivée
            </h4>
            <div className="space-y-2 lg:space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pays</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Pays"
                  value={form.watch("deliveryCountry")}
                  onChange={(e) => {
                    form.setValue("deliveryCountry", e.target.value);
                  }}
                />
              </div>
              <div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    placeholder="Ville"
                    value={form.watch("deliveryCity")}
                    onChange={(e) => {
                      form.setValue("deliveryCity", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Commune / Arrondissement
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Commune et/ou Arrondissement"
                  value={form.watch("deliveryDistrict")}
                  onChange={(e) => {
                    form.setValue("deliveryDistrict", e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Informations supplémentaires (Monument célèbre)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Informations supplémentaires"
                  value={form.watch("deliveryStreet")}
                  onChange={(e) => {
                    form.setValue("deliveryStreet", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
