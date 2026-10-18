import AuthProvider from "@/components/shared/AuthProvider";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "BrainStormVerse",
  description: "Share ideas and browse a community feed",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
    </AuthProvider>
  );
}
