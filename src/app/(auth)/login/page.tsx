"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { LoadingFullPage } from "@/components/Loading";
import { GrantedRole } from "@/type/enum";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuth();
  const { setError } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();

    try {
      const response = await login(data.email, data.password);
      toast.success("Redirection en cours.", { autoClose: 5000 });
      if (response.role === GrantedRole.Client) {
        router.push("/user/dashboard");
      } else if (
        response.role === GrantedRole.Admin ||
        response.role === GrantedRole.Livreur ||
        response.role === GrantedRole.Operateur
      ) {
        router.push("/admin/dashboard");
      } else {
        setError("Erreur d'authentification. Réessayez plus tard.");
      }
      // router.push("/dashboard");
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            C'est parti..
          </h1>
          <p className="text-gray-600">
            Vous n'avez pas encore de compte ?{" "}
            <Link href={`/register`}>
              <span className="text-[#FD481A] hover:underline font-medium cursor-pointer">
                Inscrivez-vous
              </span>
            </Link>
          </p>
        </div>

        {/* Affichage des erreurs API */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="uistore@gmail.com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: "L'email est obligatoire",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Le mot de passe est obligatoire",
                  minLength: {
                    value: 6,
                    message:
                      "Le mot de passe doit contenir au moins 6 caractères",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#FD481A] focus:ring-[#FD481A] cursor-pointer"
                {...register("rememberMe")}
              />
              <span className="ml-2 text-sm text-gray-600">
                Se souvenir de moi
              </span>
            </label>
            <span className="text-sm text-[#FD481A] hover:underline font-medium cursor-pointer">
              Mot de passe oublié ?
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading && "animate-pulse"
            } w-full bg-[#FD481A] text-white py-3.5 rounded-lg font-medium hover:bg-[#E63F15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <LoginContent />
    </Suspense>
  );
}
