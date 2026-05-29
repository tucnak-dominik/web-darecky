import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dárečky pro Dominika',
    short_name: 'Dárečky',
    description: 'Rodinný wishlist.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#fef3c7',
    icons: [{ src: '/icon', sizes: '32x32', type: 'image/png' }],
  };
}
