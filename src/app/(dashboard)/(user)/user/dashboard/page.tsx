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
                    setSelected={(value) =>
                      setValue("articleType", value as ArticleType)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Dimensions de l'article */}
            {/* <DimensionData form={form} /> */}

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
                name="description"
                id="description"
                cols={50}
                rows={3}
                placeholder="Description..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                value={description}
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

            {/* Checkbox */}
            {/* <div className="flex items-center gap-2 mb-4 lg:mb-6">
              <input
                type="checkbox"
                id="sameAddress"
                checked={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
              />
              <label htmlFor="sameAddress" className="text-sm text-gray-700">
                Mon adresse de livraison et de paiement sont identiques
              </label>
            </div> */}

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

              {/* Programmée */}
              {/* <ProgramData form={form} /> */}

              {/* Estimation */}
              {/* <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
                <p className="text-base font-bold text-gray-900">
                  Estimation Total: FCFA
                </p>
              </div> */}

              {/* Moyen de Paiement */}
              {/* <PaymentData form={form} /> */}

              {/* Colonne droite - Informations Lieu */}
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
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowUpRight,
//   Bike,
//   Car,
//   Plane,
//   Ship,
//   Truck,
//   ArchiveRestore,
// } from "lucide-react";
// import { ButtonCard } from "@/components/ButtonCard";
// import { ButtonArticle } from "@/components/ButtonArticle";
// import { GeneralData } from "./components/GeneralData";
// import { DimensionData } from "./components/DimensionData";
// import { ProgramData } from "./components/ProgramData";
// import { PaymentData } from "./components/PaymentData";
// import { MoreData } from "./components/MoreData";

// export default function DashboardPage() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDestination, setSelectedDestination] = useState("");
//   const [selectedArticleType, setSelectedArticleType] = useState("");
//   const [selectedTransportType, setSelectedTransportType] = useState("");
//   const [sameAddress, setSameAddress] = useState(false);

//   const topRef = useRef<HTMLDivElement>(null);

//   const articleTypes = [
//     { name: "Repas", icon: "🍽️" },
//     { name: "Documents", icon: "📄" },
//     { name: "Vetements", icon: "👕" },
//     { name: "Appareils", icon: "📱" },
//     { name: "Matériels", icon: "🔧" },
//     { name: "Colis", icon: "📦" },
//   ];

//   const transportTypes = [
//     { name: "Coursier", icon: Bike },
//     { name: "Tricycle", icon: Bike },
//     { name: "Voiture", icon: Car },
//     { name: "Avion", icon: Plane },
//     { name: "Camion", icon: Truck },
//     { name: "Bateau", icon: Ship },
//   ];

//   const changeStep = (newStep: number) => {
//     setCurrentStep(newStep);

//     setTimeout(() => {
//       setCurrentStep(newStep);

//       setTimeout(() => {
//         scrollToTop();
//         // setIsTransitioning(false);
//       }, 50);
//     }, 300);
//   };

//   // Fonction pour scroller vers le haut
//   const scrollToTop = () => {
//     setTimeout(() => {
//       topRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }, 100); // Petit délai pour laisser le temps au state de se mettre à jour
//   };

//   return (
//     <div className="space-y-6" ref={topRef}>
//       {/* Étape 1 - Informations de base */}
//       <div
//         className={`transition-all duration-500 ease-in-out ${
//           currentStep === 1
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-4 absolute"
//         }`}
//       >
//         {/* Lancer une course */}
//         <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
//           <div className="flex items-center justify-start gap-3 lg:gap-5 mb-4 lg:mb-6">
//             <h2 className="text-lg lg:text-xl font-bold text-gray-900">
//               Lancer une course
//             </h2>
//             <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-[#FD481A]" />
//           </div>

//           {/* Destination buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-6">
//             <ButtonCard
//               Icon={ArchiveRestore}
//               label={"Ville"}
//               id={"ville"}
//               selected={selectedDestination}
//               setSelected={setSelectedDestination}
//             />
//             <ButtonCard
//               Icon={Plane}
//               label={"A l'étranger"}
//               id={"etranger"}
//               selected={selectedDestination}
//               setSelected={setSelectedDestination}
//             />
//           </div>

//           {/* Types d'article */}
//           <div className="mb-4 lg:mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Types d'article
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {articleTypes.map((type, index) => (
//                 <ButtonArticle
//                   key={index}
//                   label={type.name}
//                   selected={selectedArticleType}
//                   setSelected={setSelectedArticleType}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Transport types */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
//             {transportTypes.map((transport, index) => {
//               const Icon = transport.icon;
//               return (
//                 <ButtonCard
//                   key={index}
//                   Icon={Icon}
//                   label={transport.name}
//                   id={transport.name}
//                   selected={selectedTransportType}
//                   setSelected={setSelectedTransportType}
//                 />
//               );
//             })}
//           </div>
//         </div>

//         {/* Information de la course */}
//         <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
//           <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
//             Information de la course
//           </h2>

//           <GeneralData />

//           {/* Checkbox */}
//           <div className="flex items-center gap-2 mb-4 lg:mb-6">
//             <input
//               type="checkbox"
//               id="sameAddress"
//               checked={sameAddress}
//               onChange={(e) => setSameAddress(e.target.checked)}
//               className="w-4 h-4 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A]"
//             />
//             <label htmlFor="sameAddress" className="text-sm text-gray-700">
//               Mon adresse de livraison et de paiement sont identiques
//             </label>
//           </div>

//           {/* Next button */}
//           <div className="flex justify-end">
//             <button
//               onClick={() => changeStep(2)}
//               className="w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors text-sm lg:text-base"
//             >
//               Suivant
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Étape 2 - Dimensions et Paiement */}
//       <div
//         className={`transition-all duration-500 ease-in-out ${
//           currentStep === 2
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-4 absolute"
//         }`}
//       >
//         <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
//           {/* Colonne gauche - Lancer une course */}
//           <div className="bg-white rounded-2xl xl:col-span-3 shadow-sm p-4 lg:p-6">
//             <div className="flex items-center justify-start gap-3 lg:gap-5 mb-4 lg:mb-6">
//               <h2 className="text-lg lg:text-xl font-bold text-gray-900">
//                 Finaliser la course
//               </h2>
//               <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-[#FD481A]" />
//             </div>

//             {/* Dimensions de l'article */}
//             <DimensionData />

//             {/* Programmée */}
//             <ProgramData />

//             {/* Estimation */}
//             <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
//               <p className="text-base font-bold text-gray-900">
//                 Estimation Total: 10.000 FCFA
//               </p>
//             </div>

//             {/* Moyen de Paiement */}
//             <PaymentData />

//             {/* Bouton */}
//             <div className="flex flex-col sm:flex-row justify-end gap-3">
//               <button
//                 onClick={() => changeStep(1)}
//                 className="w-full sm:w-auto px-6 py-3 bg-[#9D1D01B2] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors text-sm lg:text-base"
//               >
//                 Précédent
//               </button>
//               <button className="w-full sm:w-auto px-6 py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors text-sm lg:text-base">
//                 Valider
//               </button>
//             </div>
//           </div>

//           {/* Colonne droite - Informations Lieu */}
//           <div className="xl:col-span-2 space-y-4 lg:space-y-6">
//             <MoreData />
//           </div>
//         </div>
//       </div>

//       {/* Indicateur d'étape (optionnel) */}
//       <div className="flex justify-center items-center gap-2">
//         <div
//           className={`w-3 h-3 rounded-full transition-colors ${
//             currentStep === 1 ? "bg-[#FD481A]" : "bg-gray-300"
//           }`}
//         ></div>
//         <div
//           className={`w-3 h-3 rounded-full transition-colors ${
//             currentStep === 2 ? "bg-[#FD481A]" : "bg-gray-300"
//           }`}
//         ></div>
//       </div>
//     </div>
//   );
// }
