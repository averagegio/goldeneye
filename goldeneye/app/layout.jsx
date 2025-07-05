import './globals.css'

export const metadata = {
  title: 'GoldenEye',
  description: 'For England, James?',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 