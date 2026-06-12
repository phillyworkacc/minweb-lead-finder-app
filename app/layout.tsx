import "@/styles/global.css"
import "@/styles/app.css"
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { InterFont } from "./fonts";
import { ModalProvider } from "@/components/Modal/ModalContext";

export const metadata: Metadata = {
  title: "Minweb Lead Finder",
  description: "Application dedicated to finding leads for Minweb Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModalProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        </head>
        <body className={InterFont.className}>
          <Toaster richColors position="top-center" />
          {children}
        </body>
      </html>
    </ModalProvider>
  );
}
