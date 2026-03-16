// components/DimensionData.tsx
import { OrderFormData } from "@/hooks/use-order-form";
import { FieldErrors, UseFormReturn } from "react-hook-form";

interface GeneralDataProps {
  form: UseFormReturn<any>;
  errors: FieldErrors<OrderFormData>;
}

export const GeneralData = ({ form, errors }: GeneralDataProps) => {
  const country = [
    { label: "Cotonou", value: "Cotonou" },
    { label: "Porto-Novo", value: "Porto-Novo" },
    { label: "Zè", value: "Zè" },
    { label: "Sèmè-Kpodji", value: "Sèmè-Kpodji" },
    { label: "Sèmè Kraké", value: "Sèmè Kraké" },
    { label: "Djèrègbé", value: "Djèrègbé" },
    { label: "Abomey-Calavi", value: "Abomey-Calavi" },
    { label: "Glo Djigbé", value: "Glo Djigbé" },
    { label: "Pahou", value: "Pahou" },
    { label: "Adjarra", value: "Adjarra" },
    { label: "Tori", value: "Tori" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Départ */}
      <div>
        <div className="flex items-center gap-2 mb-3 lg:mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-700">
            Expéditeur / Commanditaire
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
                  Nom et Prénom(s) <strong className={`text-red-600`}>*</strong>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Nom"
                  value={form.watch("pickupName")}
                  {...form.register("pickupName", {
                    required: "Ce champ est requis",
                  })}
                  onChange={(e) => {
                    form.setValue("pickupName", e.target.value);
                  }}
                  onFocus={() => {
                    form.setError("pickupName", { message: "" });
                  }}
                  onBlur={() => {
                    if (!form.watch("pickupName")) {
                      form.setError("pickupName", {
                        message: "Ce champ est requis",
                      });
                    }
                  }}
                />
                {errors.pickupName && (
                  <p className={`text-xs text-red-600`}>
                    {errors.pickupName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 lg:mt-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Téléphone (indicatif + numéro : (229) 0197979797){" "}
                  <strong className={`text-red-600`}>*</strong>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Numéro de téléphone"
                  value={form.watch("pickupPhone")}
                  {...form.register("pickupPhone", {
                    required: "Ce champ est requis",
                  })}
                  onChange={(e) => {
                    form.setValue("pickupPhone", e.target.value);
                  }}
                  onFocus={() => {
                    form.setError("pickupPhone", { message: "" });
                  }}
                  onBlur={() => {
                    if (!form.watch("pickupPhone")) {
                      form.setError("pickupPhone", {
                        message: "Ce champ est requis",
                      });
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^\d\s\-()]/g, "");
                  }}
                />
                {errors.pickupPhone && (
                  <p className={`text-xs text-red-600`}>
                    {errors.pickupPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 lg:mb-3">
              Details Lieu de Départ
            </h4>
            <div className="space-y-2 lg:space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Pays <strong className={`text-red-600`}>*</strong>{" "}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Pays"
                  value={form.watch("pickupCountry")}
                  // onChange={(e) => {
                  //   form.setValue("pickupCountry", e.target.value);
                  // }}
                  disabled
                />
                {errors.pickupCountry && (
                  <p className={`text-xs text-red-600`}>
                    {errors.pickupCountry.message}
                  </p>
                )}
              </div>
              <div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ville <strong className={`text-red-600`}>*</strong>
                  </label>
                  {/* <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    placeholder="Ville"
                    value={form.watch("pickupCity")}
                    onChange={(e) => {
                      form.setValue("pickupCity", e.target.value);
                    }}
                  /> */}
                  <select
                    // name="pickupCity"
                    id="pickupCity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    value={form.watch("pickupCity")}
                    {...form.register("pickupCity", {
                      required: "Ce champ est requis",
                    })}
                    onChange={(e) => {
                      form.setValue("pickupCity", e.target.value);
                    }}
                    onFocus={() => {
                      form.setError("pickupCity", { message: "" });
                    }}
                    onBlur={() => {
                      if (!form.watch("pickupCity")) {
                        form.setError("pickupCity", {
                          message: "Ce champ est requis",
                        });
                      }
                    }}
                  >
                    <option value="" disabled>
                      Selectionnez une ville
                    </option>
                    {country.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.pickupCity && (
                    <p className={`text-xs text-red-600`}>
                      {errors.pickupCity.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Quartier
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Quartier"
                  value={form.watch("pickupDistrict")}
                  {...form.register("pickupDistrict")}
                />
                {errors.pickupDistrict && (
                  <p className={`text-xs text-red-600`}>
                    {errors.pickupDistrict.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Compléments d'infos / Monument célèbre
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Informations supplémentaires"
                  value={form.watch("pickupStreet")}
                  {...form.register("pickupStreet")}
                />
                {errors.pickupStreet && (
                  <p className={`text-xs text-red-600`}>
                    {errors.pickupStreet.message}
                  </p>
                )}
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
            Destinataire / Bénéficiaire
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
                  Nom et Prénom(s) <strong className={`text-red-600`}>*</strong>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Nom et Prénom(s)"
                  value={form.watch("deliveryName")}
                  {...form.register("deliveryName", {
                    required: "Ce champ est requis",
                  })}
                  onChange={(e) => {
                    form.setValue("deliveryName", e.target.value);
                  }}
                  onFocus={() => {
                    form.setError("deliveryName", { message: "" });
                  }}
                  onBlur={() => {
                    if (!form.watch("deliveryName")) {
                      form.setError("deliveryName", {
                        message: "Ce champ est requis",
                      });
                    }
                  }}
                />
                {errors.deliveryName && (
                  <p className={`text-xs text-red-600`}>
                    {errors.deliveryName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 lg:mt-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Téléphone (indicatif + numéro : (229) 0197979797){" "}
                  <strong className={`text-red-600`}>*</strong>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Numéro de téléphone"
                  value={form.watch("deliveryPhone")}
                  {...form.register("deliveryPhone", {
                    required: "Ce champ est requis",
                  })}
                  onChange={(e) => {
                    form.setValue("deliveryPhone", e.target.value);
                  }}
                  onFocus={() => {
                    form.setError("deliveryPhone", { message: "" });
                  }}
                  onBlur={() => {
                    if (!form.watch("deliveryPhone")) {
                      form.setError("deliveryPhone", {
                        message: "Ce champ est requis",
                      });
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = target.value.replace(/[^\d\s\-()]/g, "");
                  }}
                />
                {errors.deliveryPhone && (
                  <p className={`text-xs text-red-600`}>
                    {errors.deliveryPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 lg:mb-3">
              Details Lieu d'Arrivée
            </h4>
            <div className="space-y-2 lg:space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Pays <strong className={`text-red-600`}>*</strong>{" "}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Pays"
                  value={form.watch("deliveryCountry")}
                  // onChange={(e) => {
                  //   form.setValue("deliveryCountry", e.target.value);
                  // }}
                  disabled
                />
                {errors.deliveryCountry && (
                  <p className={`text-xs text-red-600`}>
                    {errors.deliveryCountry.message}
                  </p>
                )}
              </div>
              <div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Ville <strong className={`text-red-600`}>*</strong>
                  </label>
                  {/* <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    placeholder="Ville"
                    value={form.watch("deliveryCity")}
                    onChange={(e) => {
                      form.setValue("deliveryCity", e.target.value);
                    }}
                  /> */}
                  <select
                    // name="deliveryCity"
                    id="deliveryCity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                    value={form.watch("deliveryCity")}
                    {...form.register("deliveryCity", {
                      required: "Ce champ est requis",
                    })}
                    onChange={(e) => {
                      form.setValue("deliveryCity", e.target.value);
                    }}
                    onFocus={() => {
                      form.setError("deliveryCity", { message: "" });
                    }}
                    onBlur={() => {
                      if (!form.watch("deliveryCity")) {
                        form.setError("deliveryCity", {
                          message: "Ce champ est requis",
                        });
                      }
                    }}
                  >
                    <option value="" disabled>
                      Selectionnez une ville
                    </option>
                    {country.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.deliveryCity && (
                    <p className={`text-xs text-red-600`}>
                      {errors.deliveryCity.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Quartier
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Quartier"
                  value={form.watch("deliveryDistrict")}
                  {...form.register("deliveryDistrict")}
                />
                {errors.deliveryDistrict && (
                  <p className={`text-xs text-red-600`}>
                    {errors.deliveryDistrict.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Compléments d'infos / Monument célèbre
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  placeholder="Informations supplémentaires"
                  value={form.watch("deliveryStreet")}
                  {...form.register("deliveryStreet")}
                />
                {errors.deliveryStreet && (
                  <p className={`text-xs text-red-600`}>
                    {errors.deliveryStreet.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
