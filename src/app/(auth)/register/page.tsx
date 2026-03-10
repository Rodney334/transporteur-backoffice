"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check, X, Circle, ChevronDown } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { GenderType } from "@/type/enum";
import { LoadingFullPage } from "@/components/Loading";
import { RegisterData } from "@/lib/services/auth-service";
import { toast } from "react-toastify";

// Liste des pays prioritaires (Bénin en premier, puis les plus courants)
const COUNTRY_CODES = [
  { code: "+229", flag: "🇧🇯", name: "Bénin", iso: "BJ" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire", iso: "CI" },
  { code: "+221", flag: "🇸🇳", name: "Sénégal", iso: "SN" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso", iso: "BF" },
  { code: "+228", flag: "🇹🇬", name: "Togo", iso: "TG" },
  { code: "+227", flag: "🇳🇪", name: "Niger", iso: "NE" },
  { code: "+223", flag: "🇲🇱", name: "Mali", iso: "ML" },
  { code: "+237", flag: "🇨🇲", name: "Cameroun", iso: "CM" },
  { code: "+242", flag: "🇨🇬", name: "Congo", iso: "CG" },
  { code: "+243", flag: "🇨🇩", name: "RD Congo", iso: "CD" },
  { code: "+33", flag: "🇫🇷", name: "France", iso: "FR" },
  { code: "+1", flag: "🇺🇸", name: "États-Unis", iso: "US" },
];

function RegisterContent() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Bénin par défaut

  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const [passwordValue, setPasswordValue] = useState("");
  const hasMinLength = passwordValue.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterData>({
    defaultValues: {
      countryCode: "+229",
      genderrole: GenderType.Man,
      signupIntent: "client",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    clearError();
    try {
      // S'assurer que le countryCode correspond au pays sélectionné
      const payload: RegisterData = {
        ...data,
        countryCode: selectedCountry.code,
      };
      await registerUser(payload);
      toast.success("Inscription réussie ! Vérifiez votre email.", {
        autoClose: 3000,
      });
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.log("Registration failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">C'est parti..</h1>
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
            placeholder="exemple@gmail.com"
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
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number avec sélecteur de pays */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Numéro de téléphone
          </label>
          <div
            className={`flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#FD481A] focus-within:border-transparent transition-all ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          >
            {/* Sélecteur d'indicatif pays */}
            <div className="relative">
              <button
                type="button"
                id="countryCodeSelector"
                onClick={() => setShowCountryDropdown((v) => !v)}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors h-full text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                <span className="text-base">{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showCountryDropdown && (
                <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="max-h-56 overflow-y-auto">
                    {COUNTRY_CODES.map((country) => (
                      <button
                        key={country.iso}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setValue("countryCode", country.code);
                          setShowCountryDropdown(false);
                        }}
                        className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                          selectedCountry.iso === country.iso
                            ? "bg-[#FD481A]/10 text-[#FD481A] font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="flex-1">{country.name}</span>
                        <span className="text-gray-500 font-mono text-xs">
                          {country.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Champ numéro */}
            <input
              id="phoneNumber"
              type="tel"
              placeholder="01 12 34 56 78"
              className="flex-1 px-4 py-3 focus:outline-none bg-white text-sm"
              {...register("phoneNumber", {
                required: "Le numéro de téléphone est obligatoire",
                pattern: {
                  value: /^[\d\s\-().]+$/,
                  message: "Numéro de téléphone invalide (chiffres uniquement)",
                },
                minLength: {
                  value: 8,
                  message: "Le numéro doit contenir au moins 8 chiffres",
                },
              })}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Saisissez uniquement les chiffres sans l'indicatif pays
          </p>
        </div>

        {/* Signup Intent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Je m'inscris en tant que
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="signupIntent"
              control={control}
              rules={{ required: "Veuillez choisir un rôle" }}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    onClick={() => field.onChange("client")}
                    className={`cursor-pointer flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      field.value === "client"
                        ? "border-[#FD481A] bg-[#FD481A]/5 text-[#FD481A]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">📦</span>
                    <span className="text-sm font-medium">Client</span>
                    <span className="text-xs text-center opacity-70">
                      Je veux envoyer des colis
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("livreur")}
                    className={`cursor-pointer flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      field.value === "livreur"
                        ? "border-[#FD481A] bg-[#FD481A]/5 text-[#FD481A]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">🏍️</span>
                    <span className="text-sm font-medium">Livreur</span>
                    <span className="text-xs text-center opacity-70">
                      Je veux livrer des colis
                    </span>
                  </button>
                </>
              )}
            />
          </div>
          {errors.signupIntent && (
            <p className="mt-1 text-sm text-red-600">
              {errors.signupIntent.message}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD481A] focus:border-transparent transition-all bg-white"
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
                  value: 8,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères",
                },
                validate: (value) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                  "Le mot de passe doit contenir au moins un caractère spécial",
              })}
              onChange={(e) => {
                register("password").onChange(e);
                setPasswordValue(e.target.value);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {/* Password Indicators */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {passwordValue === "" ? (
                <Circle className="w-4 h-4 text-gray-300" />
              ) : hasMinLength ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span
                className={
                  passwordValue === ""
                    ? "text-gray-500"
                    : hasMinLength
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                }
              >
                Au moins 8 caractères
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {passwordValue === "" ? (
                <Circle className="w-4 h-4 text-gray-300" />
              ) : hasSpecialChar ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span
                className={
                  passwordValue === ""
                    ? "text-gray-500"
                    : hasSpecialChar
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                }
              >
                Au moins un caractère spécial
              </span>
            </div>
          </div>
          {errors.password && !hasMinLength && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          {errors.password && hasMinLength && !hasSpecialChar && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Hidden fields */}
        <input type="hidden" {...register("countryCode")} />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-full bg-[#FD481A] text-white py-3.5 rounded-lg font-medium hover:bg-[#E63F15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
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
