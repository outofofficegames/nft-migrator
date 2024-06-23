'use client'
import { useQuery } from '@tanstack/react-query'
import NftItem from './nftItem'
import { useAccount } from 'wagmi'
import { NFT } from '@/types'
import Loader from './themed/loader'
import StrokedText from './themed/strokedText'

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
    return (
      <div className=" min-h-10 flex justify-center items-center">
        Error: {error.message}
      </div>
    )
  }

  if (!data) {
    return (
      <div className=" min-h-10 flex justify-center items-center">No data</div>
    )
  }

  return (
    <>
      <div className="mb-4" />

      <StrokedText var="h2" className="text-5xl font-russo">
        Battle Derby Passes
      </StrokedText>
      <div className="mb-6" />
      {data.length === 0 ? (
        <p>You do not have any NFT on {account.chain?.name}.</p>
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
