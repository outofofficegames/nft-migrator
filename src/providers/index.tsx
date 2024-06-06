'use client'
import { State } from 'wagmi'
import ReactQueryProvider from './reactQuery'
import WalletConnectProvider from './walletconnect/context'

export default function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode
  initialState?: State
}) {
  return (
    <WalletConnectProvider initialState={initialState}>
      <ReactQueryProvider>{children} </ReactQueryProvider>
    </WalletConnectProvider>
  )
}
