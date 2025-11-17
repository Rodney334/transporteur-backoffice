"use client";
import { logoLight } from "@/files";
import Image from "next/image";
interface LoadingFullPageProps {
  text?: string;
  withLogo?: boolean;
}

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const LoadingFullPage = ({
  text = "Chargement en cours...",
  withLogo = true,
}: LoadingFullPageProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo optionnel */}
      {withLogo && (
        <div className="mb-8">
          {/* Remplacez par votre logo */}
          {/* <div className="text-2xl font-bold text-[#0C0000]">VotreLogo</div> */}
          <Image src={logoLight} alt="logo" />
        </div>
      )}

      {/* Spinner élégant */}
      <div className="relative">
        {/* Cercle externe */}
        <div className="w-20 h-20 rounded-full border-4 border-gray-100"></div>

        {/* Spinner principal */}
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-[#FD481A] border-r-[#FD481A] animate-spin"></div>

        {/* Cercle intérieur pour effet de profondeur */}
        <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-2 border-gray-200"></div>
      </div>

      {/* Texte */}
      <p className="mt-6 text-gray-600 font-medium text-lg">{text}</p>

      {/* Barre de progression subtile */}
      <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#FD481A] rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export const LoadingDots = ({
  size = "md",
  color = "#FD481A",
  className = "",
}: LoadingDotsProps) => {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={`mt-2 flex items-center justify-center space-x-1 ${className}`}
    >
      <div
        className={`${dotSizes[size]} rounded-full animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "0ms",
        }}
      ></div>
      <div
        className={`${dotSizes[size]} rounded-full animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "150ms",
        }}
      ></div>
      <div
        className={`${dotSizes[size]} rounded-full animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "300ms",
        }}
      ></div>
    </div>
  );
};

export const LoadingSpinner = ({
  size = "md",
  text = "Chargement...",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}
    >
      {/* Spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Cercle de fond */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>

        {/* Spinner animé */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-[#FD481A] border-r-[#FD481A] animate-spin ${sizeClasses[size]}`}
        ></div>
      </div>

      {/* Texte */}
      {text && (
        <p className={`mt-4 text-gray-600 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};
