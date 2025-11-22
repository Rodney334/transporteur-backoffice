"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { GenderType } from "@/type/enum";
import { LoadingFullPage } from "@/components/Loading";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  genderrole: GenderType;
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      countryCode: "BJ",
      genderrole: GenderType.Man,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();

    try {
      await registerUser(data);
      router.push(redirect);
      // router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
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
            Vous avez déjà un compte ?{" "}
            <Link href={`/login`}>
              <span className="text-[#FD481A] hover:underline font-medium cursor-pointer">
                Connectez-vous
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
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", {
                required: "Le nom complet est obligatoire",
                minLength: {
                  value: 2,
                  message: "Le nom doit contenir au moins 2 caractères",
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Numéro de téléphone
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+229 01 02 03 04"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              {...register("phoneNumber", {
                required: "Le numéro de téléphone est obligatoire",
                pattern: {
                  value: /^\+?[\d\s-]+$/,
                  message: "Numéro de téléphone invalide",
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="genderrole"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Genre
            </label>
            <select
              id="genderrole"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all"
              {...register("genderrole", {
                required: "Le genre est obligatoire",
              })}
            >
              <option value={GenderType.Man}>Homme</option>
              <option value={GenderType.Women}>Femme</option>
              <option value={GenderType.Other}>Autre</option>
            </select>
            {errors.genderrole && (
              <p className="mt-1 text-sm text-red-600">
                {errors.genderrole.message}
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

          {/* Country Code (hidden) */}
          <input type="hidden" {...register("countryCode")} />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FD481A] text-white py-3.5 rounded-lg font-medium hover:bg-[#E63F15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFullPage />}>
      <RegisterContent />
    </Suspense>
  );
}
