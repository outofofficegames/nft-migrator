export interface NFT {
    tokenId: string
    contract: {
      name: string
      symbol: string
      address: string
      openSeaMetadata?: {
        imageUrl: string
        description: string
      }
    }
    name: string
    description: string
    tokenUri?: string
    image: {
      cachedUrl: string
    }
    tokenType: string
  }