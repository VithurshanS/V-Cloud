import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V-Cloud",
  description: "Cloud Storage Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div 
          className="min-h-screen bg-base-300 bg-cover bg-blend-soft-light"
          style={{ 
            backgroundImage: "url('/4882066.jpg')",
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: -1
          }}
        />
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}

