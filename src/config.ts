export const appConfig = {
  metadata: {
    name: 'Migrator | Battle Derby',
    description: 'Migrate your Battle Derby Passes to your Immutable Passport'
  },
  evm: {
    burnAddress: '0x000000000000000000000000000000000000dead'
  },
  alchemy: {
    sepolia: 'https://eth-sepolia.g.alchemy.com',
    mainnet: 'https://eth-mainnet.g.alchemy.com'
  },
  next: {
    revalidate: 1000 * 60 * 60
  }
}
