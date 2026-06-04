import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MailConnector — Meet someone through a meaningful letter',
  description: 'No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters. Join 48,000+ members across South Africa.',
  keywords: 'dating, south africa, letters, pen pal, relationship, connection',
  authors: [{ name: 'MailConnector' }],
  metadataBase: new URL('https://mail-connector1.vercel.app'),
  verification: {
    google: 'Qa1zLxLHdEq5a7xtUdS0rUOwxN7N0hnmCt2IkBHFdA8',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'MailConnector — Meet someone through a meaningful letter',
    description: 'No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters. Join 48,000+ members across South Africa.',
    url: 'https://mail-connector1.vercel.app',
    siteName: 'MailConnector',
    images: [
      {
        url: 'https://mail-connector1.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MailConnector — Meet someone through a meaningful letter',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MailConnector — Meet someone through a meaningful letter',
    description: 'No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters.',
    images: ['https://mail-connector1.vercel.app/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}