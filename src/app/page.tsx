'use client'
import WalletConnectButton from '@/components/walletConnectButton'
import NftList from '@/components/nftList'
import { useAccount } from 'wagmi'
import PassportButton from '@/components/passportConnectButton'

export default function Home() {
  const account = useAccount()

  return (
    <section className=" flex ">
      <div className="flex-1">
        <WalletConnectButton />
        {account.isConnected ? (
          <NftList />
        ) : (
          <p>
            Connect your wallet to migrate your Battle Derby Pass nfts to your
            Immutable Passport
          </p>
        )}
      </div>
      <div className="flex-1">
        <PassportButton />
      </div>
    </section>
  )
}
