import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { resolveMode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dárečky pro Dominika',
  description: 'Tipy na dárky pro Dominika — rodinný wishlist.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = resolveMode(new Date());
  const modeClass = modeConfig[mode].cssClass;

  return (
    <html
      lang="cs"
      className={`${GeistSans.variable} ${GeistMono.variable} ${modeClass}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
