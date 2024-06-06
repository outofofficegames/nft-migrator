import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: appConfig.metadata.name,
  description: appConfig.metadata.description,
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
      <body className={clsx(inter.className, 'min-h-screen  flex flex-col')}>
        <div className="absolute inset-0 -z-10 bg-[35%_top] bg-no-repeat sm:bg-[38%_top] md:bg-[40%_top] lg:bg-[44%_top] xl:bg-top forced-colors:hidden bg-bgtop" />
        <div className="absolute inset-0 -z-10 bg-top opacity-10 forced-colors:hidden bg-bgnoise" />
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
              background: '#222',
              color: '#fff'
            }
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[35%_bottom] bg-no-repeat mix-blend-screen sm:bg-[38%_bottom] md:bg-[40%_bottom] lg:bg-[44%_bottom] xl:bg-bottom forced-colors:hidden bg-bgbottom" />
      </body>
    </html>
  )
}
