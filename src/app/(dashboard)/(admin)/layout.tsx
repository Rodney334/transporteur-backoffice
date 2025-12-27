// admin dashboard layout - VERSION AVEC FILTRAGE PAR RÔLE
"use client";

import { ReactNode, useState, useMemo } from "react";
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
  ListOrdered,
  OctagonAlert,
  Package,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}
import { logoLight, logoDark, userIcone } from "@/files";
import Image from "next/image";
import ProtectedRoute from "@/components/Protected-route";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { GrantedRole } from "@/type/enum";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Définir les menus selon le rôle de l'utilisateur
  const allNavigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutGrid,
      roles: [GrantedRole.Admin, GrantedRole.Operateur, GrantedRole.Livreur],
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Commandes",
      href: "/admin/dashboard/commande",
      icon: ListOrdered,
      roles: [GrantedRole.Admin, GrantedRole.Operateur, GrantedRole.Livreur],
      current: pathname === "/admin/dashboard/commande",
    },
    {
      name: "Livraisons",
      href: "/admin/dashboard/livraison",
      icon: BookOpen,
      roles: [GrantedRole.Admin, GrantedRole.Operateur],
      current: pathname === "/admin/dashboard/livraison",
    },
    {
      name: "Utilisateurs",
      href: "/admin/dashboard/utilisateur",
      icon: ShieldUser,
      roles: [GrantedRole.Admin, GrantedRole.Operateur],
      current: pathname === "/admin/dashboard/utilisateur",
    },
    {
      name: "Négociations",
      href: "/admin/dashboard/litige",
      icon: OctagonAlert,
      roles: [GrantedRole.Admin, GrantedRole.Operateur],
      current: pathname === "/admin/dashboard/litige",
    },
    {
      name: "Rapports",
      href: "/admin/dashboard/report",
      icon: MessageSquareMore,
      roles: [GrantedRole.Admin, GrantedRole.Operateur],
      current: pathname === "/admin/dashboard/report",
    },
    {
      name: "Paramètres",
      href: "/admin/dashboard/settings",
      icon: Settings,
      roles: [GrantedRole.Admin, GrantedRole.Operateur, GrantedRole.Livreur],
      current: pathname === "/admin/dashboard/settings",
    },
  ];

  // Filtrer les menus selon le rôle de l'utilisateur
  const navigation = useMemo(() => {
    if (!user?.role) return [];

    // Rôle livreur: seulement Commandes et Paramètres
    if (user.role === GrantedRole.Livreur) {
      return allNavigationItems.filter((item) =>
        item.roles.includes(GrantedRole.Livreur)
      );
    }

    // Rôles admin et opérateur: tous les menus autorisés pour leur rôle
    return allNavigationItems.filter((item) =>
      item.roles.includes(user.role as GrantedRole)
    );
  }, [user?.role, allNavigationItems]);

  // Adapter le titre selon le rôle
  const getUserGreeting = () => {
    if (!user) return "Anonyme";

    switch (user.role) {
      case GrantedRole.Admin:
        return `Administrateur ${user.name}`;
      case GrantedRole.Operateur:
        return `Opérateur ${user.name}`;
      case GrantedRole.Livreur:
        return `Livreur ${user.name}`;
      default:
        return user.name;
    }
  };

  // Adapter l'avatar selon le rôle
  const getRoleBadge = () => {
    if (!user?.role) return null;

    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <Link href={`/admin/dashboard/settings`}>
            <Image
              src={userIcone}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        <div className="hidden lg:block">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              user.role === GrantedRole.Admin
                ? "bg-red-100 text-red-800"
                : user.role === GrantedRole.Operateur
                ? "bg-blue-100 text-blue-800"
                : user.role === GrantedRole.Livreur
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.role === GrantedRole.Admin
              ? "Admin"
              : user.role === GrantedRole.Operateur
              ? "Opérateur"
              : user.role === GrantedRole.Livreur
              ? "Livreur"
              : "Unknown"}
          </span>
        </div>
      </div>
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ProtectedRoute
      allowedRoles={[
        GrantedRole.Admin,
        GrantedRole.Operateur,
        GrantedRole.Livreur,
      ]}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 lg:hidden"
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
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={logoDark} alt="logo" />
              {/* {user?.role && (
                <div className="text-xs">
                  <div className="font-medium">{getUserGreeting()}</div>
                  <div className="text-gray-400 capitalize">
                    {user.role === GrantedRole.Admin
                      ? "Administrateur"
                      : user.role === GrantedRole.Operateur
                      ? "Opérateur"
                      : user.role === GrantedRole.Livreur
                      ? "Livreur"
                      : user.role}
                  </div>
                </div>
              )} */}
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation filtrée par rôle */}
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

          {/* Informations du rôle */}
          <div className="p-2 border-t border-gray-800">
            <div className="text-xs text-gray-400">Rôle actuel</div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  user?.role === GrantedRole.Admin
                    ? "bg-red-500"
                    : user?.role === GrantedRole.Operateur
                    ? "bg-blue-500"
                    : user?.role === GrantedRole.Livreur
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-sm text-white capitalize">
                {user?.role === GrantedRole.Admin
                  ? "Administrateur"
                  : user?.role === GrantedRole.Operateur
                  ? "Opérateur"
                  : user?.role === GrantedRole.Livreur
                  ? "Livreur"
                  : user?.role}
              </span>
            </div>
          </div>

          {/* Déconnexion */}
          <div className="p-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
            >
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
                    {getUserGreeting()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {user?.role === GrantedRole.Livreur
                      ? "Gérez vos commandes assignées"
                      : "Tableau de bord d'administration"}
                  </p>
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
                    placeholder={
                      user?.role === GrantedRole.Livreur
                        ? "Rechercher une commande..."
                        : "Suivez votre ID....."
                    }
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
                  {user?.role === GrantedRole.Livreur && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FD481A] text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  )}
                </button>
                {getRoleBadge()}
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
                  placeholder={
                    user?.role === GrantedRole.Livreur
                      ? "Rechercher une commande..."
                      : "Suivez votre ID....."
                  }
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
    </ProtectedRoute>
  );
}
