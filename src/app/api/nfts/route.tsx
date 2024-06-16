export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const contractAddr = process.env.NEXT_PUBLIC_ORIGIN_CONTRACT_ADDRESS
  const apiKey = process.env.ALCHEMY_API_KEY

  const res = await fetch(
    `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contractAddr}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  const data = await res.json()

  return Response.json(data.ownedNfts)
}
