export const appConfig = {
  metadata: {
    name: 'Migrator | Battle Derby',
    description: 'Migrate your Battle Derby Passes to your Immutable Passport'
  },
  evm: {
    burnAddress: '0x000000000000000000000000000000000000dead'
  },
  next: {
    revalidate: 1000 * 60 * 60
  }
}
