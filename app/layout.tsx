import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

export const metadata: Metadata = {
  title: "NEWFACE – Premium Prototype",
  description:
    "Light-mode premium prototype: B2B home + chat + history + settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Premium light backdrop (rose + gold only) */}
          <div className="min-h-dvh bg-[radial-gradient(900px_circle_at_10%_-10%,rgba(232,166,187,0.35),transparent_55%),radial-gradient(900px_circle_at_90%_0%,rgba(200,162,74,0.22),transparent_55%),radial-gradient(1200px_circle_at_40%_110%,rgba(232,166,187,0.18),transparent_60%)]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
