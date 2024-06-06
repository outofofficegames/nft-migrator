'use client'
import ConnectButton from '@/components/connectButton'
import NftList from '@/components/nftList'
import { useAccount } from 'wagmi'

export default function Home() {
  const account = useAccount()

  return (
    <section className="">
      <div>
        <ConnectButton />
        {account.isConnected ? (
          <NftList />
        ) : (
          <p>
            Connect your wallet to migrate your Battle Derby Pass nfts to your
            Immutable Passport
          </p>
        )}
      </div>
    </section>
  )
}
