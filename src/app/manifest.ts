import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'משפטלי - מאגר פסקי דין',
    short_name: 'משפטלי',
    description: 'המאגר המשפטי הגדול בישראל - חיפוש פסקי דין לפי שם',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFBFC',
    theme_color: '#0B3C5D',
    dir: 'rtl',
    lang: 'he',
    icons: [
      {
        src: '/logo.png',
        sizes: '200x200',
        type: 'image/png',
      },
    ],
  };
}
