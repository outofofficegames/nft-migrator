'use client'
import { useQuery } from '@tanstack/react-query'
import NftItem from './nftItem'
import { useAccount } from 'wagmi'
import { NFT } from '@/types'
import WalletConnectButton from './walletConnectButton'
import Loader from './themed/loader'

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
    queryFn: () => getData(account.address!),
    enabled: !!account?.address,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchInterval: 0
  })
  if (account.status === 'disconnected')
    return (
      <div className="flex items-center flex-col justify-center flex-1">
        <div className=" animate-ping-custom bg-secondary/30 w-96 h-96 rounded-full blur-3xl absolute animate-di" />
        <div className="relative z-20 flex flex-col items-center justify-center">
          <h1 className=" font-black text-8xl mb-6">Connect to Web3</h1>
          <WalletConnectButton />
        </div>
      </div>
    )

  if (
    isLoading ||
    account.status === 'connecting' ||
    account.status === 'reconnecting'
  ) {
    return (
      <div>
        <Loader size="lg" />
      </div>
    )
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <>
      <h2 className=" font-black text-5xl my-6">Battle Derby Passes</h2>
      {data.length === 0 ? (
        <p>You do not have any NFT on {account.chain?.name}.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {data.map((item) => (
            <NftItem
              key={item.contract.address + '#' + item.tokenId}
              item={item}
              accountAddress={account.address}
            />
          ))}
        </ul>
      )}
      {/* <Modal isOpen={isTransferModalOpen} setIsOpen={setIsTransferModalOpen}>
        <TransferModalContent
          selectedItem={selectedItem}
          closeModal={() => setIsTransferModalOpen(false)}
        />
      </Modal> */}
    </>
  )
}
