import Image from 'next/image'
import NftList from './nftList'
import PassportButton from './passportConnectButton'
import Button from './themed/button'
import WalletConnectButton from './walletConnectButton'
import BDLogo from '#/bd-logo.png'
import { useContext } from 'react'
import { PassportUserCtx, passport } from '@/providers/passport'
import { useAccount, useSignMessage } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export async function getWalletMap() {
  const passportToken = await passport.getIdToken()

  const res = await fetch(`/api/get-migration-map`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${passportToken}`
    }
  })

  if (res.status !== 200)
    throw new Error('Fetch failed with status:' + res.status)

  return await res.json()
}

export default function MapCard() {
  const passportUser = useContext(PassportUserCtx)
  const account = useAccount()
  const { signMessageAsync } = useSignMessage()
  const bothWalletConnected =
    !!passportUser?.email && account.isConnected && !!account.address

  const { data: walletMap, isLoading: walletMapLoading } = useQuery({
    queryKey: ['walletMap', account?.address, passportUser?.email],
    queryFn: getWalletMap,
    enabled: bothWalletConnected,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchInterval: 1000 * 60 * 5
  })

  const handleMerge = async () => {
    return toast.promise(
      new Promise(async (resolve: any) => {
        if (!account.address) throw new Error('No address')
        const signedMessage = await signMessageAsync({
          account: account.address,
          message: account.address!
        })
        const passportToken = await passport.getIdToken()

        const response = await fetch('/api/create-migration-map', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${passportToken}`
          },
          body: JSON.stringify({
            eoaWallet: account.address,
            signedMessage: signedMessage,
            destinationCollectionAddress:
              process.env.NEXT_PUBLIC_DESTINATION_CONTRACT_ADDRESS
          })
        })
        const data = await response.json()
        resolve(data)
      }),
      {
        loading: 'Merging...',
        success: 'Merged!',
        error: 'Failed to merge'
      }
    )
  }

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
        {walletMap ? (
          <NftList />
        ) : (
          <div className=" contents">
            {bothWalletConnected ? (
              <p>Merge your account clicking merge button</p>
            ) : (
              <p className="text-center m-6 text-white">
                Connect your EOA wallet that you would like to migrate your nft
                from and destionation Passport
              </p>
            )}
            <Button
              onClick={handleMerge}
              big
              title="Confirm Destionation Map"
              className="w-full justify-center"
              isLoading={walletMapLoading}
              disabled={walletMap || !bothWalletConnected}
            />
          </div>
        )}
      </div>
    </div>
  )
}
