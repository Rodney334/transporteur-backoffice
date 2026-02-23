"use client";

import { useEffect, useState } from "react";
import { X, Calendar, Plus, Users, LayoutDashboard, Search, Trash2, Edit } from "lucide-react";
import { Partner, Campaign } from "../types";
import { useCampaigns } from "../hooks/use-campaigns";
import CampaignCard from "./CampaignCard";
import CampaignFormModal from "./CampaignFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface CampaignManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
}

export default function CampaignManagerModal({
  isOpen,
  onClose,
  partner,
}: CampaignManagerModalProps) {
  const { campaigns, isLoading, loadCampaigns, deleteCampaign } = useCampaigns();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && partner) {
      loadCampaigns(partner.id);
    }
  }, [isOpen, partner, loadCampaigns]);

  if (!isOpen || !partner) return null;

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEdit = (campaign: Campaign) => {
    setCampaignToEdit(campaign);
    setIsFormOpen(true);
  };

  const handleDelete = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (campaignToDelete && partner) {
      await deleteCampaign(partner.id, campaignToDelete.id);
      setIsDeleteOpen(false);
      setCampaignToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="shrink-0 h-16 w-16 rounded-full bg-linear-to-r from-[#FD481A] to-orange-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{partner.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    Préfixe: <span className="font-bold text-gray-700">{partner.codePrefix}</span>
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    partner.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {partner.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]/20 focus:border-[#FD481A]"
            />
          </div>
          <button
            onClick={() => {
              setCampaignToEdit(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FD481A] text-white rounded-lg text-sm font-bold hover:bg-[#E63F15] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle campagne
          </button>
        </div>

        {/* Liste des campagnes */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">Campagnes de promotion</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold">
              {campaigns.length}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FD481A] rounded-full animate-spin" />
              <p className="mt-4 text-gray-500 text-sm font-medium">Chargement des campagnes...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-gray-900 font-bold">Aucune campagne trouvée</h4>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                {searchTerm ? "Aucune campagne ne correspond à votre recherche." : "Commencez par créer votre première campagne de promotion."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <CampaignFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setCampaignToEdit(null);
          }}
          partnerId={partner.id}
          campaignToEdit={campaignToEdit}
        />
      )}

      {isDeleteOpen && campaignToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-60">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4 animate-bounce">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer la campagne ?</h3>
              <p className="text-gray-500 text-sm">
                Êtes-vous sûr de vouloir supprimer la campagne <b>{campaignToDelete.name}</b> ? Cette action est irréversible.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icons needed but missing in imports
function Tag({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}
