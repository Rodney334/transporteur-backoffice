// app/(dashboard)/page.tsx
"use client";

import { useState } from "react";
import { Home, Mail, Calendar, User } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    "Mes informations",
    "Profile",
    "Mot de passe",
    "Email",
    "Notification",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-8">
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

      {/* Content */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile</h2>
          <p className="text-sm text-gray-500">
            Mettez à jour votre photo et vos informations personnelles ici.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Pays et Adresse */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays de Résidence
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value="Zuichi, Switzerland"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value="2445 Crosswind Drive"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value="uihutofficial@gmail.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
              />
            </div>
          </div>

          {/* Date et Gender */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value="07.12.195"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value="Male"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Your photo
                </h3>
                <p className="text-xs text-gray-500">
                  Cela apparaîtra sur votre profil.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Delete
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-[#FD481A] hover:text-[#E63F15] transition-colors">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux Sociaux */}
          <div className="py-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Réseaux Sociaux
            </h3>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="facebook.com/"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="twitter.com/"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
