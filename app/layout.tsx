import type { Metadata } from "next"; 

import { Geist, Geist_Mono } from "next/font/google"; 


import "./globals.css"; 
import AuthProvider from "@/components/AuthProvider"; 
import ReduxProvider from "@/components/ReduxProvider"; 
import { Toaster } from "@/components/ui/toaster"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// Initializing the Geist Sans font and assigning it to a CSS variable for easy usage in styles.

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// Initializing the Geist Mono font and assigning it to a CSS variable.

export const metadata: Metadata = {
  title: "National Drone Services",
};
// Setting metadata for the application, specifically defining the title that appears on browser tabs and helps with SEO.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        {/* Wrapping the entire application in ReduxProvider and AuthProvider to manage global state and authentication. */}
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>

        {/* Adding a Toaster component for toast notifications (e.g., success or error messages). */}
        <Toaster />
      </body>
    </html>
  );
}
