import './globals.css'

export const metadata = {
  title: 'MailConnector',
  description: 'Meet people through meaningful letters',
  verification: {
    google: 'Qa1zLxLHdEq5a7xtUdS0rUOwxN7N0hnmCt2IkBHFdA8'
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