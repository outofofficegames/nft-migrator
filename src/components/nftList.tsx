'use client'
import { useQuery } from '@tanstack/react-query'
import NftItem from './nftItem'
import { useAccount } from 'wagmi'
import { NFT } from '@/types'
import Loader from './themed/loader'
import StrokedText from './themed/strokedText'
import Informer from './themed/informer'
import Button from './themed/button'

export async function getData(walletAddress: `0x${string}`) {
  const res = await fetch(`/api/nfts?address=${walletAddress}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    next: { revalidate: 0 }
  })
  if (res.status !== 200)
    throw new Error('Fetch failed with status:' + res.status)

  return (await res.json()) as NFT[]
}

export default function NftList() {
  const account = useAccount()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['nfts', account.address],
    queryFn: () => getData(account.address!)
  })

  if (isLoading) {
    return (
      <div className=" min-h-10 flex justify-center items-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (isError) {
    return <Informer text={`Error: ${error.message}`} />
  }

  if (!data) {
    return <Informer text="No data" />
  }

  return (
    <>
      <div className="mb-6" />
      <StrokedText
        var="h2"
        className="text-2xl text-center md:text-5xl font-russo"
      >
        Battle Derby Passes
      </StrokedText>
      <div className="mb-6" />
      {data.length === 0 ? (
        <div className="flex items-center flex-col">
          <Informer
            type="success"
            text={`Check your Immutable Passport for migrated NFTs. You do not have any Battle Derby Passes left in your EOA Wallet. `}
          />
          <Button
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_EVM_CHAIN_ID === '1'
                  ? 'https://passport.immutable.com'
                  : 'https://passport.sandbox.immutable.com',
                '_blank'
              )
            }
            title=" See on Immutable Passport"
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {data.map((item) => (
            <NftItem
              key={item.contract.address + '#' + item.tokenId}
              item={item}
              accountAddress={account.address!}
            />
          ))}
        </ul>
      )}
    </>
  )
}
