import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import logoLight from "@/assets/logo/logo_light.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link href="#">
          <Image
            src={logoLight}
            alt="Logo"
            width={200}
            height={50}
            className="h-auto w-auto max-w-[250px]"
            priority
          />
        </Link>
      </div>
      <div className="max-w-md w-full space-y-8">{children}</div>
    </div>
  );
}
