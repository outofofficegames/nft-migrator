'use client'
import { State } from 'wagmi'
import ReactQueryProvider from './reactQuery'
import WalletConnectProvider from './walletconnect/context'
import PassportProvider from './passport'

export default function Providers({
  children,
  initialState
}: {
  children: React.ReactNode
  initialState?: State
}) {
  return (
    <WalletConnectProvider initialState={initialState}>
      <ReactQueryProvider>
        <PassportProvider>{children} </PassportProvider>
      </ReactQueryProvider>
    </WalletConnectProvider>
  )
}
