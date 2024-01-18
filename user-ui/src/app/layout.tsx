import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from './providers/NextUiProvider'
import { Toaster } from 'react-hot-toast';
// import toast, { Toaster } from 'react-hot-toast';

// const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

export const metadata: Metadata = {
  title: 'Donfiles Food Delivery',
  description: 'Donfiles Food Delivery website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position='top-right' reverseOrder={false}/>
      </body>
    </html>
  )
}
