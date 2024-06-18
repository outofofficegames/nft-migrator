import { NFT } from '@/types'
import Image from 'next/image'
import Button from './themed/button'
import Link from 'next/link'
import { useWriteContract } from 'wagmi'
import abi from '#/abi.json'
import { waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/providers/walletconnect'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

export default function NftItem({
  item,
  accountAddress
}: {
  item: NFT
  accountAddress: string
}) {
  const { writeContractAsync } = useWriteContract()
  const client = useQueryClient()
  const handleBurn = async () => {
    toast.promise(
      new Promise(async (res, rej) => {
        try {
          const txHash = await writeContractAsync({
            abi,
            address: process.env
              .NEXT_PUBLIC_ORIGIN_CONTRACT_ADDRESS as `0x${string}`,
            functionName: 'transferFrom',
            args: [
              accountAddress,
              // '0xd31fE3b2c23bbf7301deB5888F0627482A7622B6',
              '0x0000000000000000000000000000000000000000',
              item.tokenId
            ]
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
        }
      }),
      {
        loading: 'Burning the token',
        error: (e) =>
          `Error while burning: ${e instanceof Error ? e.message : 'Unknown message'}`,
        success: 'Successfully burned'
      }
    )
  }

  return (
    <li className="text-textColor flex items-start justify-start bg-white/10 rounded-xl shadow-3xl px-8 py-9 gap-6">
      <Image
        src={item.image.cachedUrl}
        width={64}
        height={64}
        alt={item.contract.name}
        className=" flex-initial"
      />

      <div className="flex flex-col flex-shrink-0">
        <h3 className="font-bold">
          {item.contract.name}#{item.tokenId}
        </h3>
        <span className="text-sm/6 text-white/50">{item.tokenType}</span>
        <span className="text-sm/6 text-white/50">{item.contract.symbol}</span>
      </div>

      <p className="text-sm/6 text-white/50 flex-grow">{item.description}</p>
      <Link
        href={`https://sepolia.etherscan.io/nft/${item.contract.address}/${item.tokenId}`}
        target="_blank"
        className=" items-center text-xs flex gap-1"
      >
        See on Etherscan
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </Link>
      <Button
        secondary
        title="Burn NFT"
        onClick={handleBurn}
        className="flex-shrink-0"
      />
    </li>
  )
}
