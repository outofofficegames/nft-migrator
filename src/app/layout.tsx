import type { Metadata } from 'next'
import { Inter, Russo_One } from 'next/font/google'
import './globals.css'
import Providers from '@/providers'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/header'
import { cookieToInitialState } from 'wagmi'
import { headers } from 'next/headers'
import { config as wagmiConfig } from '@/providers/walletconnect'
import clsx from 'clsx'
import Footer from '@/components/footer'
import { appConfig } from '@/config'
import Image from 'next/image'
import BGImage from '#/bg.png'
import BGImageMobile from '#/bg-mobile.png'
const inter = Inter({ subsets: ['latin'] })
const russo = Russo_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-russo'
})
export const metadata: Metadata = {
  title: appConfig.metadata.name,
  description: appConfig.metadata.description,
  metadataBase: new URL('https://migrate.battlederby.com'),
  keywords: [
    'Battle Derby',
    'Web3 gaming',
    'Token rewards',
    'Blockchain',
    'airdrop',
    'free',
    'quests',
    'rewards',
    'farming',
    'challenges',
    'Web3 features',
    'gaming',
    'Crypto',
    'Free airdrop',
    'nft migrator',
    'Token',
    '$TOG'
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get('cookie')
  )

  return (
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          russo.variable,
          'min-h-screen relative flex flex-col'
        )}
      >
        <Image
          src={BGImage}
          alt="Battle Derby"
          fill
          className="object-cover md:block hidden"
        />
        <Image
          src={BGImageMobile}
          alt="Battle Derby"
          fill
          className=" object-cover md:hidden "
        />
        <Providers initialState={initialState}>
          <Header />
          <main className="relative mx-auto my-4 max-w-7xl md:my-8 flex flex-col flex-1">
            {children}
          </main>
        </Providers>
        <Footer />
        <Toaster
          toastOptions={{
            style: {
              backgroundColor: '#00126D',
              color: '#fff'
            }
          }}
        />
      </body>
    </html>
  )
}
