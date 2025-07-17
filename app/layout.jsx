import { Inter, Orbitron } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-orbitron'
})

export const metadata = {
  title: 'GOLDENEYE',
  description: 'Intelligence Division',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 