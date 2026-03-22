"use client";

import {
  Star,
  X,
  User,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react";
import { useUsersManagement } from "@/hooks/use-users-management";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function LivreurReviewsModal() {
  const {
    selectedLivreur,
    livreurReviews,
    livreurReviewStat,
    isReviewsModalOpen,
    closeReviewsModal,
    isLoadingReviews,
  } = useUsersManagement();

  if (!isReviewsModalOpen || !selectedLivreur) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FD481A]/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-[#FD481A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Avis & Notes</h3>
              <p className="text-sm text-gray-500">{selectedLivreur.name}</p>
            </div>
          </div>
          <button
            onClick={closeReviewsModal}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoadingReviews ? (
            <div className="flex flex-col items-center justify-center py-20 translate-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD481A]"></div>
              <p className="mt-4 text-gray-500 font-medium">
                Chargement des avis...
              </p>
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              {livreurReviewStat && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex flex-col items-center text-center">
                    <TrendingUp className="w-5 h-5 text-amber-600 mb-2" />
                    <span className="text-3xl font-black text-amber-700">
                      {livreurReviewStat.average.toFixed(1)}
                    </span>
                    <div className="mt-1">
                      {renderStars(Math.round(livreurReviewStat.average))}
                    </div>
                    <span className="text-xs font-bold text-amber-600/70 mt-2 uppercase tracking-wider">
                      Moyenne
                    </span>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex flex-col items-center text-center">
                    <MessageSquare className="w-5 h-5 text-blue-600 mb-2" />
                    <span className="text-3xl font-black text-blue-700">
                      {livreurReviewStat.count}
                    </span>
                    <span className="text-xs font-bold text-blue-600/70 mt-auto uppercase tracking-wider">
                      Avis Totaux
                    </span>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-5 border border-green-100 flex flex-col items-center text-center">
                    <Award className="w-5 h-5 text-green-600 mb-2" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-green-700">
                        {livreurReviewStat.min}
                      </span>
                      <span className="text-gray-400 px-1">-</span>
                      <span className="text-2xl font-black text-green-700">
                        {livreurReviewStat.max}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-green-600/70 mt-auto uppercase tracking-wider">
                      Plage de Notes
                    </span>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">
                  Derniers commentaires
                </h4>

                {livreurReviews.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Aucun commentaire pour le moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {livreurReviews.map((review, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                Client #{review.clientId.slice(-6)}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {format(
                                  new Date(review.createdAt),
                                  "dd MMM yyyy",
                                  { locale: fr },
                                )}
                              </div>
                            </div>
                          </div>
                          {renderStars(Number(review.rating))}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                          "{review.comment || "Aucun commentaire laissé."}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={closeReviewsModal}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
