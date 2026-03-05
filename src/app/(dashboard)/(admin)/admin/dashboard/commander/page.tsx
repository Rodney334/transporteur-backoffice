// app/dashboard/page.tsx (version mise à jour)
"use client";

import { useOrderForm } from "@/hooks/use-order-form";
import { ButtonCard } from "@/components/ButtonCard";
import { ButtonArticle } from "@/components/ButtonArticle";
import { GeneralData } from "@/app/(dashboard)/(user)/user/dashboard/components/GeneralData";
import { MoreData } from "@/app/(dashboard)/(user)/user/dashboard/components/MoreData";
import {
  ArrowUpRight,
  Bike,
  Car,
  Truck,
  Motorbike,
  Rocket,
  Hourglass,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  ArticleType,
  DeliveryType,
  GrantedRole,
  TransportMode,
} from "@/type/enum";
import ProtectedRoute from "@/components/Protected-route";
import { useOrderValidation } from "@/hooks/use-order-validation";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    onSubmit,
    validateCodepromo,
  } = useOrderForm();

  const { validateStep1, isValidatingPromo } = useOrderValidation();
  const [isChangingStep, setIsChangingStep] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = form;

  // const selectedDestination = watch("destination");
  const description = watch("description");
  const selectedArticleType = watch("articleType");
  const selectedTransportType = watch("transportMode");
  const deliveryType = watch("deliveryType");

  const articleTypes = [
    { name: "Documents", value: ArticleType.DOCUMENT },
    { name: "Colis", value: ArticleType.COLIS },
    { name: "Fragile", value: ArticleType.FRAGILE },
    { name: "Electronique", value: ArticleType.ELECTRONIQUE },
    { name: "Alimentaire", value: ArticleType.ALIMENTAIRE },
    { name: "Autre", value: ArticleType.AUTRE },
  ];

  const transportTypes = [
    { name: "Moto", icon: Motorbike, value: TransportMode.MOTO },
    { name: "Voiture", icon: Car, value: TransportMode.VOITURE },
    { name: "Camion", icon: Truck, value: TransportMode.CAMION },
    { name: "Vélo", icon: Bike, value: TransportMode.VELO },
  ];

  const topRef = useRef<HTMLDivElement>(null);

  // const changeStep = (newStep: number) => {
  //   setCurrentStep(newStep);

  //   setTimeout(() => {
  //     setCurrentStep(newStep);

  //     setTimeout(() => {
  //       scrollToTop();
  //       // setIsTransitioning(false);
  //     }, 50);
  //   }, 300);
  // };

  // Fonction pour scroller vers le haut
  const changeStep = async (newStep: number) => {
    if (isChangingStep) return; // Empêcher les clics multiples

    if (newStep === 2) {
      setIsChangingStep(true);

      try {
        // Réinitialiser les erreurs avant validation
        const fieldsToValidate = [
          "articleType",
          "deliveryCity",
          "deliveryCountry",
          "deliveryDistrict",
          "deliveryName",
          "deliveryPhone",
          "deliveryStreet",
          "deliveryType",
          "description",
          "pickupCity",
          "pickupCountry",
          "pickupDistrict",
          "pickupName",
          "pickupPhone",
          "pickupStreet",
        ];

        // Ne pas clear l'erreur du promoCodeId ici
        fieldsToValidate.forEach((field) => {
          form.clearErrors(field as any);
        });

        // Petite pause pour s'assurer que les clears sont bien pris en compte
        await new Promise((resolve) => setTimeout(resolve, 50));

        const isValid = await validateStep1(form, validateCodepromo);

        if (!isValid) {
          // Récupérer les erreurs actuelles pour un message plus précis
          const currentErrors = form.formState.errors;
          const errorFields = Object.keys(currentErrors)
            .map((key) => {
              if (key === "promoCodeId") return "code promo";
              return key;
            })
            .join(", ");

          toast.warning(
            `Veuillez remplir correctement tous les champs obligatoires${errorFields ? ` : ${errorFields}` : ""}.`,
            {
              position: "top-left",
              autoClose: 7000,
            },
          );
          return;
        }

        // Si tout est valide, on change d'étape
        setCurrentStep(newStep);
        scrollToTop();
      } catch (error) {
        console.error("Erreur lors de la validation:", error);
        toast.error("Une erreur est survenue lors de la validation.");
      } finally {
        setIsChangingStep(false);
      }
    } else {
      setCurrentStep(newStep);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Admin]}>
      <div className="space-y-6" ref={topRef}>
        <form onSubmit={onSubmit}>
          {/* Étape 1 - Informations de base */}
          <div className={`${currentStep === 1 ? "block" : "hidden"} `}>
            {/* Lancer une course */}
            <div className="bg-white rounded-2xl shadow-sm mb-4 p-4 lg:p-6">
              <div className="flex items-center justify-start gap-3 lg:gap-5 mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  Lancer une course
                </h2>
                <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-[#FD481A]" />
              </div>

              <div className={`mb-5`}>
                <span>
                  Obligatoire ( <strong className={`text-red-600`}>*</strong> )
                </span>
              </div>

              {/* Destination buttons */}
              <div className="flex flex-col gap-3 mb-4 lg:mb-6">
                <h3 className="text-sm font-semibold text-gray-700">
                  Types de livraison{" "}
                  <strong className={`text-red-600`}>*</strong>
                </h3>
                <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                  <ButtonCard
                    Icon={Hourglass}
                    label={"Standard"}
                    id={"standard"}
                    selected={deliveryType}
                    setSelected={(value) =>
                      setValue("deliveryType", value as DeliveryType)
                    }
                  />
                  <ButtonCard
                    Icon={Rocket}
                    label={"Express"}
                    id={"express"}
                    selected={deliveryType}
                    setSelected={(value) =>
                      setValue("deliveryType", value as DeliveryType)
                    }
                  />
                </div>
              </div>

              {/* Types d'article */}
              <div className="mb-4 lg:mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Types d'article <strong className={`text-red-600`}>*</strong>
                </h3>
                <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                  {articleTypes.map((type, index) => (
                    <ButtonArticle
                      key={index}
                      label={type.name}
                      value={type.value}
                      selected={selectedArticleType}
                      setSelected={(value) =>
                        setValue("articleType", value as ArticleType)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Transport types */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                {transportTypes.map((transport, index) => {
                  const Icon = transport.icon;
                  return (
                    <ButtonCard
                      key={index}
                      Icon={Icon}
                      label={transport.name}
                      id={transport.value}
                      selected={selectedTransportType}
                      setSelected={(value) =>
                        setValue("transportMode", value as TransportMode)
                      }
                    />
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm mb-4 p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                Information sur le colis{" "}
                <strong className={`text-red-600`}>**</strong>
              </h2>
              <div className={`flex flex-col mb-4 lg:mb-6`}>
                <label htmlFor="weight">Poids en kg (optionnel)</label>
                <input
                  id="weight"
                  type="text"
                  placeholder="Poids (kg)"
                  {...register("weight")}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                />
              </div>

              <div className={`flex flex-col mb-4 lg:mb-6`}>
                <label htmlFor="description">
                  Description <strong className={`text-red-600`}>*</strong>
                </label>
                <textarea
                  // name="description"
                  id="description"
                  cols={50}
                  rows={3}
                  placeholder="Description..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  value={description}
                  {...register("description", {
                    required: "Ce champ est requis",
                  })}
                  onChange={(e) => setValue("description", e.target.value)}
                  onFocus={() => {
                    setError("description", { message: "" });
                  }}
                  onBlur={() => {
                    if (!description) {
                      setError("description", {
                        message: "Ce champ est requis",
                      });
                    }
                  }}
                ></textarea>
                {errors.description && (
                  <p className={`text-xs text-red-600`}>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className={`flex flex-col mb-4 lg:mb-6`}>
                <label htmlFor="scheduledAt">
                  Date de livraison programmée (optionnel)
                </label>
                <input
                  id="scheduledAt"
                  type="time"
                  {...register("scheduledAt")}
                  min={new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                />
              </div>

              <div className={`flex flex-col mb-4 lg:mb-6`}>
                <label htmlFor="promoCodeId">Code promo (optionnel)</label>
                <input
                  id="promoCodeId"
                  type="text"
                  placeholder="Entrez votre code promo"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                {...register("promoCodeId")}
              />
                {errors.promoCodeId && (
                  <p className={`text-xs text-red-600`}>
                    {errors.promoCodeId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Information de la course */}
            <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                Information de la course{" "}
                <strong className={`text-red-600`}>**</strong>
              </h2>

              <GeneralData form={form} errors={errors} />

              {/* Next button */}
              <div className="flex justify-end">
                {/* <button
                  type="button"
                  onClick={() => changeStep(2)}
                  className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base"
                >
                  Suivant
                </button> */}
                <button
                  type="button"
                  onClick={() => changeStep(2)}
                  disabled={isChangingStep || isValidatingPromo}
                  className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base flex items-center justify-center gap-2"
                >
                  {(isChangingStep || isValidatingPromo) && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isChangingStep || isValidatingPromo
                    ? "Validation..."
                    : "Suivant"}
                </button>
              </div>
            </div>
          </div>

          {/* Étape 2 - Dimensions et Paiement */}
          <div className={currentStep === 2 ? "block" : "hidden"}>
            <div>
              {/* Colonne gauche - Lancer une course */}
              <div className="bg-white rounded-2xl xl:col-span-3 shadow-sm p-4 lg:p-6">
                <div className="flex items-center justify-start gap-3 lg:gap-5 mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                    Finaliser la course
                  </h2>
                  <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-[#FD481A]" />
                </div>

                {/* Colonne droite - Informations Lieu */}
                <div className="mb-4">
                  <MoreData form={form} />
                </div>

                {/* Bouton */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => changeStep(1)}
                    className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-[#9D1D01B2] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors text-sm lg:text-base"
                  >
                    Précédent
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base"
                  >
                    {isSubmitting ? "Création..." : "Valider"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Indicateur d'étape */}
        <div className="flex justify-center items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              currentStep === 1 ? "bg-[#FD481A]" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              currentStep === 2 ? "bg-[#FD481A]" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
