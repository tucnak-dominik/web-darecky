import { BotIdClient } from 'botid/client';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { resolveMode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dárečky pro Dominika',
  description: 'Tipy na dárky pro Dominika — rodinný wishlist s rezervacemi.',
  metadataBase: new URL('https://dareckyprodominika.cz'),
  openGraph: {
    title: 'Dárečky pro Dominika',
    description: 'Tipy na dárky pro Dominika — rodinný wishlist s rezervacemi.',
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://dareckyprodominika.cz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dárečky pro Dominika',
    description: 'Rodinný wishlist s rezervacemi.',
  },
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
        {process.env.VERCEL_ENV && (
          <BotIdClient
            protect={[
              { path: '/api/claim/*', method: 'POST' },
              { path: '/api/claim/*', method: 'DELETE' },
            ]}
          />
        )}
        <Providers serverMode={mode}>{children}</Providers>
      </body>
    </html>
  );
}
