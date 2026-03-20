"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  User as UserIcon,
  Tag,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { formSubmissionService } from "@/lib/services/form-submission-service";
import { FormSubmission } from "@/type/form-submission.type";
import { FormType } from "@/type/enum";
import { LoadingDots } from "@/components/Loading";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Filtres
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formSubmissionService.getSubmissions(currentPage, itemsPerPage);
      
      // Filtrage côté client si l'API ne le supporte pas encore
      let data = response.data;
      if (filterType !== "all") {
        data = data.filter(s => s.type === filterType);
      }
      if (filterStatus === "handled") {
        data = data.filter(s => s.isHandled);
      } else if (filterStatus === "pending") {
        data = data.filter(s => !s.isHandled);
      }

      setSubmissions(data);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      toast.error("Impossible de charger les soumissions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterType, filterStatus]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette soumission ?")) return;

    try {
      await formSubmissionService.deleteSubmission(id);
      toast.success("Soumission supprimée");
      fetchSubmissions();
    } catch (error) {
      toast.error("Échec de la suppression");
    }
  };

  const handleToggleHandled = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await formSubmissionService.toggleHandled(id, !currentStatus);
      toast.success(currentStatus ? "Marqué comme non traité" : "Marqué comme traité");
      fetchSubmissions();
    } catch (error) {
      toast.error("Échec de la mise à jour");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getFormTypeLabel = (type: FormType) => {
    switch (type) {
      case FormType.NetworkJoin: return "Rejoindre le réseau";
      case FormType.Contact: return "Contact";
      case FormType.Partnership: return "Partenariat";
      default: return type;
    }
  };

  const getFormTypeColor = (type: FormType) => {
    switch (type) {
      case FormType.NetworkJoin: return "bg-blue-100 text-blue-700";
      case FormType.Contact: return "bg-purple-100 text-purple-700";
      case FormType.Partnership: return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes Web</h1>
          <p className="text-gray-500">Gérez les messages et demandes reçus via le site vitrine.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] appearance-none"
            >
              <option value="all">Tous les types</option>
              <option value={FormType.Contact}>Contact</option>
              <option value={FormType.NetworkJoin}>Réseau</option>
              <option value={FormType.Partnership}>Partenariat</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A] appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="handled">Traités</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <LoadingDots />
          <p className="mt-4 text-gray-500">Chargement des demandes...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-200 border-dashed text-center p-8">
          <Mail className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucune demande trouvée</h3>
          <p className="text-gray-500 mt-1">Les nouvelles demandes apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
                expandedId === item._id ? "border-[#FD481A] ring-1 ring-[#FD481A]/10" : "border-gray-200 hover:border-gray-300"
              } ${item.isHandled ? "bg-gray-50/50" : ""}`}
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => toggleExpand(item._id)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-lg ${getFormTypeColor(item.type)}`}>
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{item.fullName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getFormTypeColor(item.type)}`}>
                          {getFormTypeLabel(item.type)}
                        </span>
                        {item.isHandled && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Traité
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {item.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          {item.phoneNumber}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(item.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      onClick={(e) => handleToggleHandled(item._id, item.isHandled, e)}
                      className={`p-2 rounded-xl border transition-colors ${
                        item.isHandled 
                        ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" 
                        : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                      }`}
                      title={item.isHandled ? "Marquer comme non traité" : "Marquer comme traité"}
                    >
                      {item.isHandled ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={(e) => handleDelete(item._id, e)}
                      className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="ml-2 text-gray-400">
                      {expandedId === item._id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                  </div>
                </div>

                {expandedId === item._id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {item.country && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pays</p>
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" /> {item.country}
                          </p>
                        </div>
                      )}
                      {item.appliedPosition && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Poste souhaité</p>
                          <p className="text-sm text-gray-900 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" /> {item.appliedPosition}
                          </p>
                        </div>
                      )}
                      {item.subject && (
                        <div className="col-span-full space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Objet</p>
                          <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {item.message || "Aucun message fourni."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Simple */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">
            Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur{" "}
            <span className="font-medium">{totalItems}</span> résultats
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Précédent
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                    ? "bg-[#FD481A] text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
