// app/layout.tsx
import AuthProvider from "@/components/Auth-provider";
import { WebSocketProvider } from "@/components/WebSocketProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <AuthProvider>
        <WebSocketProvider>{children}</WebSocketProvider>
      </AuthProvider> */}
      <WebSocketProvider>{children}</WebSocketProvider>
      {/* {children} */}
    </>
  );
}
