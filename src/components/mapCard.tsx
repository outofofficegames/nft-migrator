import Image from 'next/image'
import NftList from './nftList'
import PassportButton from './passportConnectButton'
import Button from './themed/button'
import WalletConnectButton from './walletConnectButton'
import BDLogo from '#/bd-logo.png'
import { useContext, useState } from 'react'
import { PassportUserCtx, passport } from '@/providers/passport'
import { useAccount, useSignMessage, useSwitchChain } from 'wagmi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Informer from './themed/informer'
import Loader from './themed/loader'
import { getData as getBattleDerbyPasses } from './nftList'

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
  const chain = useSwitchChain()
  const client = useQueryClient()
  const [isWalletMapping, setIsWalletMapping] = useState(false)
  const bothWalletConnected =
    !!passportUser?.email && account.isConnected && !!account.address

  const { data: walletMap, isLoading: walletMapFetching } = useQuery({
    queryKey: ['walletMap', account?.address, passportUser?.email],
    queryFn: getWalletMap,
    enabled: bothWalletConnected,
    retry: 1,
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
          if (!process.env.NEXT_PUBLIC_EVM_CHAIN_ID)
            throw new Error('Missing target chain Id')
          if (chain.data?.id !== +process.env.NEXT_PUBLIC_EVM_CHAIN_ID) {
            await chain.switchChainAsync({
              chainId: +process.env.NEXT_PUBLIC_EVM_CHAIN_ID
            })
          }

          const battleDerbyPasses = await getBattleDerbyPasses(account.address)

          if (!battleDerbyPasses || battleDerbyPasses.length === 0)
            throw new Error(
              'You do not own any Battle Derby Passes on connected EOA Wallet'
            )

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

  if (
    passportUser === undefined ||
    account.isConnecting ||
    account.isReconnecting
  )
    return <Loader />

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={BDLogo}
        alt="Battle Derby Logo"
        width={200}
        className="mb-6"
      />
      <div className="bg-[#034ee1]/10 backdrop-blur-md rounded-xl p-4 md:p-6 md:min-w-[600px] max-w-full md:max-w-screen-lg">
        <div className="flex gap-4 flex-1 md:justify-between">
          <WalletConnectButton />
          <PassportButton />
        </div>
        {walletMapFetching ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : walletMap ? (
          <NftList />
        ) : (
          <div className=" contents">
            {bothWalletConnected ? (
              <>
                <Informer
                  text={
                    'Merge your wallets by confirming origin and destination wallets. You can not change this migration map later, so double check your connected wallets!'
                  }
                />
                <Button
                  onClick={handleMerge}
                  big
                  title="Confirm Migration Map"
                  className="w-full justify-center"
                  isLoading={walletMapFetching || isWalletMapping}
                  disabled={walletMap || !bothWalletConnected}
                />
              </>
            ) : (
              <Informer
                text={`Connect your ${account.address ? '' : 'EOA Wallet that you would like to migrate from'} ${account.address || passportUser ? '' : 'and'} ${passportUser ? '' : 'destination Passport Wallet'}`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
