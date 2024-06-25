import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { appConfig } from '@/config'

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID
const evmChainId = process.env.NEXT_PUBLIC_EVM_CHAIN_ID

if (!projectId) throw new Error('Project ID is not defined')
if (!evmChainId) throw new Error('EVM Chain ID is not defined')

const metadata = {
  name: appConfig.metadata.name,
  description: appConfig.metadata.description,
  url: 'https://migrate.battlederby.com', // origin must match your domain & subdomain
  icons: [
    'https://migrate.battlederby.com/icon.png',
    'https://migrate.battlederby.com/favicon.ico'
  ]
}

// Create wagmiConfig
const chains = [process.env.evmChainId === '1' ? mainnet : sepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})
