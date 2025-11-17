// app/layout.tsx
import ToastProvider from "@/components/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
