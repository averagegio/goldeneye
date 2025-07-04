import './globals.css'

export const metadata = {
  title: 'Goldeneye App',
  description: 'Created with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 