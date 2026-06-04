import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MailConnector — Meet someone through a meaningful letter',

  description:
    'No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters. Join thousands of members across South Africa.',

  applicationName: 'MailConnector',

  metadataBase: new URL('https://mail-connector1.vercel.app'),

  alternates: {
    canonical: 'https://mail-connector1.vercel.app',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'Social Networking',

  keywords: [
    'dating',
    'south africa',
    'relationships',
    'pen pals',
    'letters',
    'friendship',
    'online dating',
    'social networking',
    'mail connector',
    'meet people',
    'love',
    'connection',
  ],

  authors: [
    {
      name: 'MailConnector',
    },
  ],

  creator: 'MailConnector',

  publisher: 'MailConnector',

  verification: {
    google: 'Qa1zLxLHdEq5a7xtUdS0rUOwxN7N0hnmCt2IkBHFdA8',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  openGraph: {
    title: 'MailConnector — Meet someone through a meaningful letter',

    description:
      'No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters.',

    url: 'https://mail-connector1.vercel.app',

    siteName: 'MailConnector',

    locale: 'en_ZA',

    type: 'website',

    images: [
      {
        url: 'https://mail-connector1.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MailConnector',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'MailConnector — Meet someone through a meaningful letter',

    description:
      'No swiping. No algorithms. Just real people connecting through thoughtful, heartfelt letters.',

    images: ['https://mail-connector1.vercel.app/og-image.png'],
  },

  other: {
    'facebook-domain-verification': '',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MailConnector',
    url: 'https://mail-connector1.vercel.app',
    description:
      'Meet someone through meaningful letters. Real connections without swiping.',
    publisher: {
      '@type': 'Organization',
      name: 'MailConnector',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mail-connector1.vercel.app/logo.png',
      },
    },
  }

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {children}
      </body>
    </html>
  )
}