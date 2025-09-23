import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Analytics from '@/components/analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lastello Analytics',
  description: 'Monitoraggio dei dati del settore funebre',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
