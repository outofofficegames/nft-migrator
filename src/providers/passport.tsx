import { passport as passportInitializer, config } from '@imtbl/sdk'
import { UserProfile } from '@imtbl/sdk/passport'
import { createContext, useEffect, useState } from 'react'
export const passport = new passportInitializer.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_IMX_PUB_KEY
  },
  clientId: process.env.NEXT_PUBLIC_IMX_CLIENT_ID!,
  redirectUri: 'http://localhost:3001/login',
  logoutRedirectUri: 'http://localhost:3001',
  logoutMode: 'redirect',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
})

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
