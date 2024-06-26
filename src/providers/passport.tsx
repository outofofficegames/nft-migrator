import { passport as passportInitializer, config } from '@imtbl/sdk'
import { UserProfile } from '@imtbl/sdk/passport'
import { createContext, useEffect, useState } from 'react'

const clientId = process.env.NEXT_PUBLIC_IMX_CLIENT_ID
const redirectUri = process.env.NEXT_PUBLIC_IMX_REDIRECT_URI
const evmChainId = process.env.NEXT_PUBLIC_EVM_CHAIN_ID
if (!evmChainId) throw new Error('NEXT_PUBLIC_EVM_CHAIN_ID not set')
if (!clientId) throw new Error('NEXT_PUBLIC_IMX_CLIENT_ID not set')
if (!redirectUri) throw new Error('NEXT_PUBLIC_IMX_REDIRECT_URI not set')
export const passport = new passportInitializer.Passport({
  baseConfig: {
    environment:
      evmChainId === '1'
        ? config.Environment.PRODUCTION
        : config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_IMX_PUB_KEY
  },
  clientId,
  redirectUri,
  logoutRedirectUri: process.env.NEXT_PUBLIC_IMX_LOGOUT_URI,
  logoutMode: 'redirect',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
})
interface BDUserProfile extends UserProfile {
  address?: string
}
// we use undefined state in initialization stage, null if initialized but no user
export const PassportUserCtx = createContext<undefined | null | BDUserProfile>(
  undefined
)
export const PassportUserSetCtx =
  createContext<null | React.Dispatch<BDUserProfile>>(null)

export default function PassportProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [passportUser, setPassportUser] = useState<BDUserProfile | null>()

  useEffect(() => {
    async function setUserAsync() {
      try {
        const user = await passport.getUserInfo()
        if (user) {
          const provider = passport.connectEvm({ announceProvider: false })
          const rpcRequest: any = await provider.send({
            method: 'eth_requestAccounts'
          })

          setPassportUser({ ...user, address: rpcRequest.result[0] })
        } else {
          setPassportUser(null)
        }
      } catch (e) {
        console.error(e)
        setPassportUser(null)
      }
    }
    setUserAsync()
  }, [])

  return (
    <PassportUserCtx.Provider value={passportUser}>
      <PassportUserSetCtx.Provider value={setPassportUser}>
        {children}
      </PassportUserSetCtx.Provider>
    </PassportUserCtx.Provider>
  )
}
