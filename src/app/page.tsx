'use client'
import WalletConnectButton from '@/components/walletConnectButton'
import NftList from '@/components/nftList'
import { useAccount } from 'wagmi'
import PassportButton from '@/components/passportConnectButton'
import MapCard from '@/components/mapCard'

export default function Home() {
  const account = useAccount()

  return (
    <section className=" flex justify-center items-center flex-1">
      <MapCard />
    </section>
  )
}
