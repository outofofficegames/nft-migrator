import { appConfig } from '@/config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const contractAddr = process.env.NEXT_PUBLIC_ORIGIN_CONTRACT_ADDRESS
  const apiKey = process.env.ALCHEMY_API_KEY
  const chainId = process.env.NEXT_PUBLIC_EVM_CHAIN_ID
  if (!address) throw new Error('No address provided')
  if (!contractAddr) throw new Error('Origin contractAddress is missing')
  if (!apiKey) throw new Error('apiKey is missing')
  if (!chainId) throw new Error('chainId is missing')

  const res = await fetch(
    `${chainId === '1' ? appConfig.alchemy.mainnet : appConfig.alchemy.sepolia}/nft/v3/${apiKey}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contractAddr}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 }
    }
  )
  const data = await res.json()

  return Response.json(data.ownedNfts)
}
