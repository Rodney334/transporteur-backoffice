"use client";

import { CheckCircle } from "lucide-react";

export default function TrackingPage() {
  const trackingSteps = [
    {
      title: "Merci de nous faire confiance",
      completed: true,
    },
    {
      title: "Colis reçu",
      completed: true,
    },
    {
      title: "En cours de livraison",
      completed: true,
    },
    {
      title: "Transporté par le coursier Maulana",
      completed: true,
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Suivre votre Commande
        </h1>

        {/* Numéro de suivi */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">
            Numéro de suivi
          </span>
          <span className="text-sm font-semibold text-gray-900">
            #ADE01-123456
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-6 mb-8">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Circle and line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step.completed
                      ? "border-[#FD481A] bg-[#FD481A]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {step.completed && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      step.completed ? "bg-red-300" : "bg-gray-300"
                    }`}
                    style={{ marginTop: "4px", marginBottom: "4px" }}
                  ></div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 pt-0.5">
                <p
                  className={`text-sm font-medium ${
                    step.completed ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="w-full py-3.5 bg-[#FD481A] text-white font-medium rounded-lg hover:bg-[#E63F15] transition-colors">
          Confirmation terminée
        </button>
      </div>
    </div>
  );
}
