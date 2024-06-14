import Image from 'next/image'
import NftList from './nftList'
import PassportButton from './passportConnectButton'
import Button from './themed/button'
import WalletConnectButton from './walletConnectButton'
import BDLogo from '#/bd-logo.png'
import { useContext } from 'react'
import { PassportUserCtx } from '@/providers/passport'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'

export async function getData(walletAddress: `0x${string}`) {
  const res = await fetch(
    `https://battle-derby-api-oexyjdos5a-od.a.run.app/=${walletAddress}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  if (res.status !== 200)
    throw new Error('Fetch failed with status:' + res.status)

  return await res.json()
}

export default function MapCard() {
  const passportUser = useContext(PassportUserCtx)
  const account = useAccount()
  const merged = passportUser?.email && account.isConnected

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['merged', account.address],
    queryFn: () => getData(account.address!),
    enabled: !!account?.address,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchInterval: 1000 * 60 * 5
  })

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={BDLogo}
        alt="Battle Derby Logo"
        width={200}
        className="mb-6"
      />
      <div className="bg-black/10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex gap-4 flex-grow flex-1 justify-between">
          <WalletConnectButton />
          <PassportButton />
        </div>
        {!merged ? (
          <div className=" contents">
            <p className="text-center m-6 text-white">
              Connect your EOA wallet that you would like to migrate your nft
              from and destionation Passport
            </p>
            <Button
              big
              title="Confirm Destionation Map"
              className="w-full justify-center"
              // disabled
            />
          </div>
        ) : (
          <NftList />
        )}
      </div>
    </div>
  )
}
