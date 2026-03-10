"use client";

import { useState } from "react";
import { X, Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { orderService } from "@/lib/services/order-service";

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderReference: string;
  onSuccess?: () => void;
}

const EMOJIS = [
  "😢",
  "☹️",
  "🙁",
  "😐",
  "🙂",
  "😊",
  "😀",
  "😁",
  "🤩",
  "🚀",
  "💎",
];

export default function OrderReviewModal({
  isOpen,
  onClose,
  orderId,
  orderReference,
  onSuccess,
}: OrderReviewModalProps) {
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await orderService.reviewOrder(orderId, {
        rating,
        comment: comment.trim(),
      });
      setIsSuccess(true);
      toast.success("Merci pour votre avis !");
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setIsSuccess(false);
        setComment("");
        setRating(10);
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de l'envoi de l'avis",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmoji = (val: number) => EMOJIS[val] || "😊";
  const getColor = (val: number) => {
    if (val <= 3) return "text-red-500";
    if (val <= 6) return "text-orange-500";
    if (val <= 8) return "text-green-500";
    return "text-[#FD481A]";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Votre avis</h3>
            <p className="text-sm text-gray-500 mt-1">
              Commande:{" "}
              <span className="font-mono font-medium text-gray-700">
                {orderReference}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Merci !</h4>
            <p className="text-gray-500">
              Votre avis a été enregistré avec succès.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-6 space-y-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
              {/* Rating Section */}
              <div className="space-y-4 text-center">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Note sur 10
                </label>

                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`text-6xl transition-all duration-300 transform scale-110`}
                  >
                    {getEmoji(rating)}
                  </div>
                  <div className={`text-3xl font-black ${getColor(rating)}`}>
                    {rating} / 10
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FD481A]"
                  />

                  <div className="flex justify-between w-full px-2 text-[10px] font-bold text-gray-400 uppercase">
                    <span>Très Déçu</span>
                    <span>Moyen</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-2">
                <label
                  htmlFor="comment"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#FD481A]" />
                  Commentaire (optionnel)
                </label>
                <div className="relative">
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    placeholder="Qu'avez-vous pensé de notre service ?"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none text-gray-700"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] font-medium text-gray-400">
                    {comment.length} / 500
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Submit */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FD481A] text-white font-bold rounded-2xl hover:bg-[#E63F15] transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Envoyer mon avis
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
