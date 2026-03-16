"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function NotificationRedirectPage() {
  const router = useRouter();
  const { isClient, isLivreur, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (isClient) {
      router.replace("/user/dashboard/history");
    } else if (isLivreur) {
      router.replace("/admin/dashboard/commande");
    } else {
      // Fallback to home/login if role is not recognized or user not logged in
      router.replace("/");
    }
  }, [isClient, isLivreur, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9D1D01] mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Redirection en cours...</p>
      </div>
    </div>
  );
}
