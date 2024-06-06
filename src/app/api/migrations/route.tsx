import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export async function GET(request: Request) {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })
  const some = await publicClient.waitForTransactionReceipt({
    hash: '0x497a2c05caf41c0248c10332717a4681ea42372645295cc68044c81bb1309b2a'
  })

  return Response.json(some.logs[0].address)
}
