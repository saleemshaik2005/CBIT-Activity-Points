import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CBIT Activity Point System - Autonomous Activity Points Tracking',
  description: 'Chaitanya Bharathi Institute of Technology (CBIT Autonomous), Hyderabad - Automated Student Activity Point System with AI Document Intelligence, 24 Categories Tracking, and Graduation Approvals. Developed by Students of AI & Data Science (AI&DS, 5th Sem, 2026) under the guidance of Dr. D. Ramana Sir.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CBIT Activity Point System',
  },
};

export const viewport: Viewport = {
  themeColor: '#385529',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf9f5] dark:bg-[#121214] text-[#1c2718] dark:text-[#f3f4f6] flex flex-col antialiased selection:bg-[#385529] dark:selection:bg-emerald-700 selection:text-white transition-colors">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </AppProvider>
      </body>
    </html>
  );
}
