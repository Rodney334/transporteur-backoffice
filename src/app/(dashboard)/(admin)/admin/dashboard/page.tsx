"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CommandCard } from "./components/CommandCard";
import { InfoSection } from "./components/InfoSection";

interface CommandCardProps {
  command: any;
  onReject: (command: any) => void;
  onAccept: (command: any) => void;
  onViewDetails: (command: any) => void;
}

interface InfoSectionProps {
  title: string;
  data: any;
}

// Composant réutilisable pour une commande
// const CommandCard = ({
//   command,
//   onReject,
//   onAccept,
//   onViewDetails,
// }: CommandCardProps) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <div className="text-sm font-semibold text-[#FD481A] mb-1">
//             Reference no : {command.reference}
//           </div>
//           <div className="text-xs text-gray-400">{command.date}</div>
//         </div>
//         <button
//           onClick={() => onViewDetails(command)}
//           className="text-sm font-medium text-gray-900 hover:text-[#FD481A] transition-colors"
//         >
//           Voir Plus de Details
//         </button>
//       </div>

//       {/* Route */}
//       <div className="space-y-4 mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
//             <div className="w-2 h-2 bg-white rounded-full"></div>
//           </div>
//           <span className="text-sm font-medium text-gray-900">
//             Depart : {command.departure}
//           </span>
//         </div>

//         <div className="flex items-center gap-3 pl-2.5">
//           <div className="w-0.5 h-8 bg-red-300"></div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
//             <div className="w-2 h-2 bg-white rounded-full"></div>
//           </div>
//           <span className="text-sm font-medium text-gray-900">
//             Arrivée : {command.arrival}
//           </span>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-3">
//         <button
//           onClick={() => onReject(command)}
//           className="flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg hover:bg-[#E63F15] transition-colors"
//         >
//           Rejeter
//         </button>
//         <button
//           onClick={() => onAccept(command)}
//           className="flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg hover:bg-[#E63F15] transition-colors"
//         >
//           Accepter
//         </button>
//       </div>
//     </div>
//   );
// };

// Composant réutilisable pour les informations de détail
// const InfoSection = ({ title, data }: InfoSectionProps) => {
//   return (
//     <div>
//       <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
//       <div className="space-y-2">
//         {data.map((item: any, index: string) => (
//           <p key={index} className="text-xs text-gray-600">
//             {item}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Nouvelles");
  const [selectedCommand, setSelectedCommand] = useState(null);

  const tabs = ["Nouvelles", "En cours", "Terminées"];

  const commands = [
    {
      id: 1,
      reference: "#ADE01-123456",
      date: "15:06 , 15/09/2025",
      departure: "Cotonou",
      arrival: "Calavi",
    },
    {
      id: 2,
      reference: "#ADE01-123456",
      date: "15:06 , 15/09/2025",
      departure: "Cotonou",
      arrival: "Calavi",
    },
    {
      id: 3,
      reference: "#ADE01-123456",
      date: "15:06 , 15/09/2025",
      departure: "Cotonou",
      arrival: "Calavi",
    },
  ];

  const handleReject = (command: any) => {
    console.log("Reject command:", command);
  };

  const handleAccept = (command: any) => {
    console.log("Accept command:", command);
  };

  const handleViewDetails = (command: any) => {
    setSelectedCommand(command);
  };

  const contactData = [
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
  ];

  const detailsData = [
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
    "Graduation Date : Your CDIM - Location",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne gauche - Liste des commandes */}
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Nouvelles Commandes
            </h1>
            <ArrowUpRight className="w-6 h-6 text-[#FD481A]" />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
            ))}
          </div>

          {/* Liste des commandes */}
          <div className="space-y-4">
            {commands.map((command) => (
              <CommandCard
                key={command.id}
                command={command}
                onReject={handleReject}
                onAccept={handleAccept}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Colonne droite - Détails */}
      <div className="space-y-6">
        {/* Détails de la Commande */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Détails de la Commande
          </h2>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Informations Lieu de Départ
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoSection title="Contact Envoyeur" data={contactData} />
              <InfoSection title="Details Colis" data={detailsData} />
            </div>
          </div>
        </div>

        {/* Détails du prix */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Détails du prix
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Prix Client
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg font-bold text-gray-900">10.000 FCFA</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Prix Livreur
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg font-bold text-gray-900">10.000 FCFA</p>
              </div>
            </div>

            <button className="w-full py-3 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors">
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
