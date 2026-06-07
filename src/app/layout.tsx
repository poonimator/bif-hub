import type { Metadata } from 'next';
import { Space_Mono, Public_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--loaded-space-mono',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--loaded-public-sans',
  display: 'swap',
});

// DM Mono — interactive chrome (nav, toggles, buttons), matching the marketing site.
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--loaded-dm-mono',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'BIF 27',
  description: 'Bhutan Innovation Festival — Brand Intelligence',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-view-mode="human" className={`${spaceMono.variable} ${publicSans.variable} ${dmMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
