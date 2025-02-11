import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'הלכה למעשה | בית ההוראה',
  description: 'בית ההוראה הלכה למעשה - מרכז תורני להוראה והפצת תורה. שיעורים, שאלות ותשובות, ספרים והלכות יומיומיות',
  keywords: 'הלכה, בית הוראה, שיעורי תורה, שאלות ותשובות, ספרי הלכה, רבנים, לוח זמנים',
  authors: [{ name: 'הלכה למעשה' }],
  openGraph: {
    title: 'הלכה למעשה | בית ההוראה',
    description: 'בית ההוראה הלכה למעשה - מרכז תורני להוראה והפצת תורה',
    type: 'website',
    locale: 'he_IL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'הלכה למעשה | בית ההוראה',
    description: 'בית ההוראה הלכה למעשה - מרכז תורני להוראה והפצת תורה',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-wheat-50 min-h-screen flex flex-col">
        <div className="min-h-screen bg-wheat-50 flex flex-col">
          <ToastProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}