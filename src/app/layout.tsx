import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'CBIT MAR - Student Activity Points Management System',
  description: 'Chaitanya Bharathi Institute of Technology (CBIT Autonomous) Hyderabad - Mandatory Additional Requirements (MAR) Activity Points Automation & AI Document Intelligence System',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CBIT MAR',
  },
};

export const viewport: Viewport = {
  themeColor: '#0066cc',
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
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {children}
          </main>
          <MobileNav />
        </AppProvider>
      </body>
    </html>
  );
}
