import Image from 'next/image'
import NftList from './nftList'
import PassportButton from './passportConnectButton'
import Button from './themed/button'
import WalletConnectButton from './walletConnectButton'
import BDLogo from '#/bd-logo.png'
import { useContext, useState } from 'react'
import { PassportUserCtx, passport } from '@/providers/passport'
import { useAccount, useSignMessage } from 'wagmi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Informer from './themed/informer'

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
  const client = useQueryClient()
  const [isWalletMapping, setIsWalletMapping] = useState(false)
  const bothWalletConnected =
    !!passportUser?.email && account.isConnected && !!account.address

  const { data: walletMap, isLoading: walletMapFetching } = useQuery({
    queryKey: ['walletMap', account?.address, passportUser?.email],
    queryFn: getWalletMap,
    enabled: bothWalletConnected,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchInterval: 0
  })

  const handleMerge = async () => {
    toast.promise(
      new Promise(async (res, rej) => {
        try {
          setIsWalletMapping(true)
          if (!account.address) throw new Error('No address')

          const signedMessage = await signMessageAsync(
            {
              account: account.address,
              message: account.address!
            },
            {
              onError: (e) => rej(e),
              onSettled(_, e) {
                if (e) rej(e)
              }
            }
          )

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
          if (!response.ok) rej(new Error('Fetch failed'))
          const data = await response.json()
          await client.invalidateQueries({
            queryKey: ['walletMap', account?.address, passportUser?.email]
          })

          res(data)
        } catch (e) {
          rej(e)
        } finally {
          setIsWalletMapping(false)
        }
      }),
      {
        loading: 'Merging wallets, please wait...',
        success: 'Merged successfully!',
        error: (e) =>
          `Merge Error: ${e instanceof Error ? e.message : 'Unkown error'}`
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
      <div className="bg-[#034ee1]/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex gap-4 flex-grow flex-1 justify-between">
          <WalletConnectButton />
          <PassportButton />
        </div>
        {walletMap ? (
          <NftList />
        ) : (
          <div className=" contents">
            {bothWalletConnected ? (
              <>
                <Informer text={'Merge your account clicking merge button'} />
                <Button
                  onClick={handleMerge}
                  big
                  title="Confirm Destionation Map"
                  className="w-full justify-center"
                  isLoading={walletMapFetching || isWalletMapping}
                  disabled={walletMap || !bothWalletConnected}
                />
              </>
            ) : (
              <Informer
                text={
                  'Connect your EOA wallet that you would like to migrate your nft from and destionation Passport'
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
