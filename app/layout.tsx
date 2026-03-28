import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'HS Dashboard | Retailer Performance',
  description: 'Retailer performance analytics dashboard',
  icons: { icon: 'https://cms-assets.ldsvcplatform.com/IT/s3fs-public/inline-images/logo_new1.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
