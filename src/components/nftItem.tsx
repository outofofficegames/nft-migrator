import { NFT } from '@/types'
import Image from 'next/image'
import Button from './themed/button'
import { useSwitchChain, useWriteContract } from 'wagmi'
import abi from '#/abi.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/providers/walletconnect'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import StrokedText from './themed/strokedText'
import { appConfig } from '@/config'
import { useState } from 'react'
import BDPCover from '#/bdp-cover.jpg'

export default function NftItem({
  item,
  accountAddress
}: {
  item: NFT
  accountAddress: `0x${string}`
}) {
  const [burning, setBurning] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const chain = useSwitchChain()
  const client = useQueryClient()
  const handleBurn = async () => {
    toast.promise(
      new Promise(async (res, rej) => {
        try {
          setBurning(true)
          if (!accountAddress) throw new Error('Missing account address')
          if (!process.env.NEXT_PUBLIC_EVM_CHAIN_ID)
            throw new Error('Missing target chain Id')

          if (chain.data?.id !== +process.env.NEXT_PUBLIC_EVM_CHAIN_ID) {
            await chain.switchChainAsync({
              chainId: +process.env.NEXT_PUBLIC_EVM_CHAIN_ID
            })
          }

          const txHash = await writeContractAsync({
            abi,
            address: process.env
              .NEXT_PUBLIC_ORIGIN_CONTRACT_ADDRESS as `0x${string}`,
            functionName: 'safeTransferFrom',
            args: [accountAddress, appConfig.evm.burnAddress, item.tokenId]
          })
          const receipt = await waitForTransactionReceipt(config, {
            hash: txHash
          })

          if (receipt.status === 'reverted')
            rej(new Error('Transaction reverted'))
          await client.invalidateQueries({ queryKey: ['nfts', accountAddress] })

          res(receipt.status)
        } catch (e) {
          rej(e)
        } finally {
          setBurning(false)
        }
      }),
      {
        loading: 'Burning the token',
        error: (e) =>
          `Error while burning: ${e instanceof Error ? e.message : 'Unknown message'}`,
        success: 'Successfully burned! See it in your Immutable Passport.'
      },
      {
        duration: 10000,
        style: {
          fontWeight: 'bold',
          fontSize: '18px'
        }
      }
    )
  }

  return (
    <li className="text-textColor min-w-[600px] flex items-start justify-between bg-[#034ee1] rounded-xl shadow-3xl px-8 py-9 gap-6 relative">
      <div className="flex items-center gap-5">
        <Image
          src={BDPCover}
          width={64}
          height={64}
          alt={item.contract.name}
          className=" flex-initial border-2 rounded-md border-[#00126D]"
        />

        <div className="flex flex-col flex-shrink-0 z-20">
          <StrokedText var="h3" className="font-bold font-russo">
            {item.contract.name}#{item.tokenId}
          </StrokedText>
          <span className="text-sm/6 text-white/50">{item.tokenType}</span>
          <span className="text-sm/6 text-white/50">
            {item.contract.symbol}
          </span>
        </div>
        {/* <p className="text-sm/6 text-white/50 flex-grow">{item.description}</p> */}
      </div>

      <Button
        secondary
        isLoading={burning}
        title="Burn NFT"
        onClick={handleBurn}
        className="flex-shrink-0"
      />
      <div className=" absolute top-2 left-2 -right-2 bg-[#00126D] -bottom-2 z-[-1] rounded-xl" />
    </li>
  )
}
