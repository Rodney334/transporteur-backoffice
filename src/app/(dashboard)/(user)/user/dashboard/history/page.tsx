"use client";

import { Package, PackageCheck } from "lucide-react";
import { DeliveryCardInterface, HistoriqueDataType } from "./types/type";
import { DeliveryCard } from "./components/DeliveryCard";

export default function HistoriquePage() {
  const envoisData: HistoriqueDataType[] = [
    {
      id: "#ADE01-123456",
      from: "Cotonou",
      to: "Libreville",
      status: "En cours d'envoi",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Calavi",
      to: "Akpakpa",
      status: "Envoyé avec succès",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Kandi",
      to: "Pobè",
      status: "Annulé",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Kandi",
      to: "Pobè",
      status: "Annulé",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Kandi",
      to: "Pobè",
      status: "Annulé",
      date: "5 Mai 2024",
    },
  ];

  const recusData = [
    {
      id: "#ADE01-123456",
      from: "Cotonou",
      to: "Libreville",
      status: "En cours d'envoi",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Calavi",
      to: "Akpakpa",
      status: "Envoyé avec succès",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Kandi",
      to: "Pobè",
      status: "Annulé",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Kandi",
      to: "Pobè",
      status: "Annulé",
      date: "5 Mai 2024",
    },
    {
      id: "#ADE01-123456",
      from: "Kandi",
      to: "Pobè",
      status: "Annulé",
      date: "5 Mai 2024",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Envoyés */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Envoyés</h2>
          <span className="ml-auto text-3xl font-bold text-gray-900">433</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Historique des envois
          </h3>
          <select className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FD481A]">
            <option>Ce mois-ci</option>
            <option>Ce trimestre</option>
            <option>Cette année</option>
          </select>
        </div>

        <div className="space-y-3">
          {envoisData.map((item, index) => (
            <DeliveryCard key={index} item={item} type="envoye" />
          ))}
        </div>
      </div>

      {/* Reçus */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#FD481A] rounded-full flex items-center justify-center">
            <PackageCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reçus</h2>
          <span className="ml-auto text-3xl font-bold text-gray-900">110</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Historique des envois
          </h3>
          <select className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FD481A]">
            <option>Ce mois-ci</option>
            <option>Ce trimestre</option>
            <option>Cette année</option>
          </select>
        </div>

        <div className="space-y-3">
          {recusData.map((item, index) => (
            <DeliveryCard key={index} item={item} type="recu" />
          ))}
        </div>
      </div>
    </div>
  );
}
