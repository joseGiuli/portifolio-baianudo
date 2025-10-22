import { GoogleTagManager } from '@next/third-parties/google';
import Footer from '@/components/layout/Footer';
import localfont from 'next/font/local';
import { Urbanist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import I18nProvider from '@/components/providers/I18nProvider';

const primary = Urbanist({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata = {
  title: {
    default: 'Portfólio | Lucas Souza — UX/UI Designer',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${primary.variable}  overflow-hidden`}>
        <I18nProvider>
          <Navbar />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
