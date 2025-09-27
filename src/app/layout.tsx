import './../index.css';
import React from 'react';
import { DataProvider } from '../contexts/DataContext';
import Header from '../components/icons/Header';
import Footer from '../components/icons/Footer';
import Marquee from '../components/icons/Marquee';
import { Toaster } from 'react-hot-toast';
import { getFirebaseData } from '../lib/firebase-data';
import { Montserrat, Playfair_Display } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'Perfect Models Management',
  description: "L'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData = await getFirebaseData();

  return (
    <html lang="fr" className={`${montserrat.variable} ${playfairDisplay.variable}`}>
      <body className="bg-pm-dark text-pm-off-white font-sans">
        <DataProvider initialData={initialData}>
          <div className="min-h-screen flex flex-col">
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            <Marquee />
            <Header />
            <main className="flex-grow pt-24 lg:pt-28">
              {children}
            </main>
            <Footer />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
