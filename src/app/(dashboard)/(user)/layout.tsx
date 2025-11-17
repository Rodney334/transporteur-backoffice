// user dashboard layout
"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Settings,
  LogOut,
  Search,
  Bell,
  FlipVertical,
  BookOpen,
  ShieldUser,
  MessageSquareMore,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}
import { logoLight, logoDark } from "@/files";
import Image from "next/image";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Acceuil",
      href: "/user/dashboard", //"/admin/dashboard",
      icon: LayoutGrid,
      current: pathname === "/user/dashboard",
    },
    {
      name: "Historique",
      href: "/user/dashboard/history",
      icon: BookOpen,
      current: pathname === "/user/dashboard/history",
    },
    {
      name: "Tracking",
      href: "/user/dashboard/tracking",
      icon: ShieldUser,
      current: pathname === "/user/dashboard/tracking",
    },
    {
      name: "Message",
      href: "/user/dashboard/message",
      icon: MessageSquareMore,
      current: pathname === "/user/dashboard/message",
    },
    {
      name: "Paramètres",
      href: "/user/dashboard/settings",
      icon: Settings,
      current: pathname === "/user/dashboard/settings",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 w-64 bg-[#0C0000] text-white flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 max-h-screen
      `}
      >
        {/* Header Sidebar avec bouton fermer */}
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={logoDark} alt="logo" />
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  item.current
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
                onClick={closeSidebar}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b-4 border-b-gray-300 border-gray-200 sticky top-0 z-10 mx-4 mt-2 rounded-2xl shadow">
          <div className="px-4 py-4 lg:px-8 flex items-center justify-between">
            {/* Bouton menu mobile et user greeting */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Bienvenu John Doe
                </h2>
              </div>
            </div>

            {/* Search bar - cachée sur mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  color={"#9D1D01B2"}
                />
                <input
                  type="text"
                  placeholder="Suivez votre ID....."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border text-[#FD481AB2] focus:text-gray-500 border-[#9D1D01B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481AB2] focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-50 rounded">
                  <FlipVertical width={25} height={25} color={"#9D1D01B2"} />
                </button>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              {/* Bouton recherche mobile */}
              <button className="md:hidden p-2 hover:bg-gray-50 border border-[#9D1D01B2] rounded-full transition-colors">
                <Search width={20} height={20} color={"#9D1D01B2"} />
              </button>

              <button className="relative p-2 hover:bg-gray-50 border border-[#9D1D01B2] rounded-full transition-colors">
                <Bell width={25} height={25} color={"#9D1D01B2"} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Search bar mobile - en dessous */}
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                color={"#9D1D01B2"}
              />
              <input
                type="text"
                placeholder="Suivez votre ID....."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border text-[#FD481AB2] focus:text-gray-500 border-[#9D1D01B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481AB2] focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-50 rounded">
                <FlipVertical width={25} height={25} color={"#9D1D01B2"} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
