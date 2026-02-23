"use client";

import { useState } from "react";
import { Users, Plus, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PartnerTable from "../components/PartnerTable";
import PartnerFormModal from "../components/PartnerFormModal";
import CampaignManagerModal from "../components/CampaignManagerModal";
import BatchPromoModal from "../components/BatchPromoModal";
import CampaignFormModal from "../components/CampaignFormModal";
import ProtectedRoute from "@/components/Protected-route";
import { GrantedRole } from "@/type/enum";
import { usePartners } from "../hooks/use-partners";
import { Partner } from "../types";

export default function PartnersPage() {
  const {
    partners,
    isLoading,
    loadPartners,
    deletePartner,
    setSelectedPartner,
    selectedPartner,
  } = usePartners();

  // Modals visibility
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [isCampaignManagerOpen, setIsCampaignManagerOpen] = useState(false);
  const [isBatchPromoOpen, setIsBatchPromoOpen] = useState(false);
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  
  // Selected items for editing
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);

  const handleCreatePartner = () => {
    setPartnerToEdit(null);
    setIsPartnerFormOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setPartnerToEdit(partner);
    setIsPartnerFormOpen(true);
  };

  const handleDeletePartner = async (partner: Partner) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le partenaire "${partner.name}" ?`)) {
      await deletePartner(partner.id);
    }
  };

  const handleCreateCampaign = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsCampaignFormOpen(true);
  };

  const handleViewCampaigns = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsCampaignManagerOpen(true);
  };

  const handleGenerateBatch = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsBatchPromoOpen(true);
  };

  const getActiveStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <ProtectedRoute allowedRoles={[GrantedRole.Admin]}>
      <div className="space-y-6">
        {/* Navigation & En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard/codepromo"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-[#FD481A]" />
                Gestion des partenaires
              </h1>
              <p className="text-gray-500 mt-1">
                Gérez vos compagnies partenaires et leurs campagnes de promotion
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreatePartner}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg hover:bg-[#E63F15] transition-colors shadow-md font-bold"
            >
              <Plus className="w-4 h-4" />
              Nouveau partenaire
            </button>

            <button
              onClick={loadPartners}
              disabled={isLoading}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#131313] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Tableau des partenaires */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <PartnerTable
            partners={partners}
            isLoading={isLoading}
            getActiveStatusColor={getActiveStatusColor}
            onEdit={handleEditPartner}
            onDelete={handleDeletePartner}
            onCreateCampaign={handleCreateCampaign}
            onViewCampaigns={handleViewCampaigns}
            onGenerateBatch={handleGenerateBatch}
          />
        </div>

        {/* Modals */}
        <PartnerFormModal
          isOpen={isPartnerFormOpen}
          onClose={() => {
            setIsPartnerFormOpen(false);
            setPartnerToEdit(null);
          }}
          partnerToEdit={partnerToEdit}
        />

        <CampaignManagerModal
          isOpen={isCampaignManagerOpen}
          onClose={() => {
            setIsCampaignManagerOpen(false);
            setSelectedPartner(null);
          }}
          partner={selectedPartner}
        />

        <BatchPromoModal
          isOpen={isBatchPromoOpen}
          onClose={() => {
            setIsBatchPromoOpen(false);
            setSelectedPartner(null);
          }}
          partner={selectedPartner}
        />

        {selectedPartner && (
          <CampaignFormModal
            isOpen={isCampaignFormOpen}
            onClose={() => {
              setIsCampaignFormOpen(false);
              setSelectedPartner(null);
            }}
            partnerId={selectedPartner.id}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
