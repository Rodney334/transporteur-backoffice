// app/dashboard/page.tsx (version mise à jour)
"use client";

import { useOrderForm } from "@/hooks/use-order-form";
import { ButtonCard } from "@/components/ButtonCard";
import { ButtonArticle } from "@/components/ButtonArticle";
import { GeneralData } from "./components/GeneralData";
import { DimensionData } from "./components/DimensionData";
import { ProgramData } from "./components/ProgramData";
import { PaymentData } from "./components/PaymentData";
import { MoreData } from "./components/MoreData";
import {
  ArrowUpRight,
  Bike,
  Car,
  Plane,
  Truck,
  ArchiveRestore,
  Motorbike,
  FastForward,
  Rocket,
  Hourglass,
} from "lucide-react";
import { useRef, useState } from "react";
import { ArticleType, DeliveryType, TransportMode } from "@/type/enum";

export default function DashboardPage() {
  const {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    sameAddress,
    setSameAddress,
    onSubmit,
  } = useOrderForm();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // const selectedDestination = watch("destination");
  const description = watch("description");
  const selectedArticleType = watch("articleType");
  const selectedTransportType = watch("transportMode");
  const deliveryType = watch("deliveryType");

  const articleTypes = [
    { name: "Documents", value: ArticleType.DOCUMENT, disabled: false },
    { name: "Colis", value: ArticleType.COLIS, disabled: false },
    { name: "Fragile", value: ArticleType.FRAGILE, disabled: false },
    { name: "Electronique", value: ArticleType.ELECTRONIQUE, disabled: false },
    { name: "Alimentaire", value: ArticleType.ALIMENTAIRE, disabled: false },
    { name: "Autre", value: ArticleType.AUTRE, disabled: false },
  ];

  const transportTypes = [
    {
      name: "Moto",
      icon: Motorbike,
      value: TransportMode.MOTO,
      disabled: false,
    },
    {
      name: "Voiture",
      icon: Car,
      value: TransportMode.VOITURE,
      disabled: true,
    },
    {
      name: "Camion",
      icon: Truck,
      value: TransportMode.CAMION,
      disabled: true,
    },
    { name: "Vélo", icon: Bike, value: TransportMode.VELO, disabled: true },
  ];

  const topRef = useRef<HTMLDivElement>(null);

  const changeStep = (newStep: number) => {
    setCurrentStep(newStep);

    setTimeout(() => {
      setCurrentStep(newStep);

      setTimeout(() => {
        scrollToTop();
        // setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Fonction pour scroller vers le haut
  const scrollToTop = () => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100); // Petit délai pour laisser le temps au state de se mettre à jour
  };

  return (
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

            {/* Destination buttons */}
            <div className="flex flex-col gap-3 mb-4 lg:mb-6">
              <h3 className="text-sm font-semibold text-gray-700">
                Types de livraison
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
                Types d'article
              </h3>
              <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                {articleTypes.map((type, index) => (
                  <ButtonArticle
                    key={index}
                    label={type.name}
                    value={type.value}
                    selected={selectedArticleType}
                    disabled={type.disabled}
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
                    disabled={transport.disabled}
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
              Information sur le colis
            </h2>
            <div className={`flex flex-col mb-4 lg:mb-6`}>
              <label htmlFor="weight">
                Poids en kg (faites une estimation même si vous n'êtes pas sûr)
              </label>
              <input
                id="weight"
                type="text"
                placeholder="Poids (kg)"
                {...register("weight", { required: "Le poids est requis" })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
              />
            </div>

            <div className={`flex flex-col mb-4 lg:mb-6`}>
              <label htmlFor="description">Description</label>
              <textarea
                // name="description"
                id="description"
                cols={50}
                rows={3}
                placeholder="Description..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                value={description}
                {...register("description", {
                  required: "La description est requise",
                })}
                onChange={(e) => setValue("description", e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Information de la course */}
          <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
              Information de la course
            </h2>

            <GeneralData form={form} />

            {/* Next button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => changeStep(2)}
                // disabled={!selectedTransportType || !selectedArticleType}
                className="w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        {/* Étape 2 - Dimensions et Paiement */}
        <div className={currentStep === 2 ? "block" : "hidden"}>
          {/* <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6"> */}
          <div>
            {/* Colonne gauche - Lancer une course */}
            <div className="bg-white rounded-2xl xl:col-span-3 shadow-sm p-4 lg:p-6">
              <div className="flex items-center justify-start gap-3 lg:gap-5 mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                  Finaliser la course
                </h2>
                <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-[#FD481A]" />
              </div>

              <div className="mb-4">
                <MoreData form={form} />
              </div>

              {/* Bouton */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => changeStep(1)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#9D1D01B2] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors text-sm lg:text-base"
                >
                  Précédent
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base"
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
  );
}
