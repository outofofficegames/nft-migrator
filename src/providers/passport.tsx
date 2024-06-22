import { passport as passportInitializer, config } from '@imtbl/sdk'
import { UserProfile } from '@imtbl/sdk/passport'
import { createContext, useEffect, useState } from 'react'

const clientId = process.env.NEXT_PUBLIC_IMX_CLIENT_ID
const redirectUri = process.env.NEXT_PUBLIC_IMX_REDIRECT_URI
if (!clientId) throw new Error('NEXT_PUBLIC_IMX_CLIENT_ID not set')
if (!redirectUri) throw new Error('NEXT_PUBLIC_IMX_REDIRECT_URI not set')
export const passport = new passportInitializer.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_IMX_PUB_KEY
  },
  clientId,
  redirectUri,
  logoutRedirectUri: process.env.NEXT_PUBLIC_IMX_LOGOUT_URI,
  logoutMode: 'redirect',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
})

// we use undefined state in initialization stage, null if initialized but no user
export const PassportUserCtx = createContext<undefined | null | UserProfile>(
  undefined
)
export const PassportUserSetCtx =
  createContext<null | React.Dispatch<UserProfile>>(null)

export default function PassportProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [passportUser, setPassportUser] = useState<UserProfile | null>()

  useEffect(() => {
    async function setUserAsync() {
      const user = await passport.getUserInfo()
      setPassportUser(!user ? null : user)
      if (user) {
        const provider = passport.connectEvm()
        provider.send({ method: 'eth_requestAccounts' })
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
