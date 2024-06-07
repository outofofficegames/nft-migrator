import {
  passport,
  PassportUserCtx,
  PassportUserSetCtx
} from '@/providers/passport'
import { useContext } from 'react'
import Button from './themed/button'

export default function PassportButton() {
  const passportUser = useContext(PassportUserCtx)
  const passportUserSet = useContext(PassportUserSetCtx)
  const handleLogin = async () => {
    const user = await passport.login()
    if (user) {
      passportUserSet?.(user)
    }
  }
  const handleLogout = () => {
    passport.logout()
  }

  if (passportUser === undefined) return null

  if (passportUser)
    return (
      <div>
        {passportUser.email}
        <Button title="Logout" onClick={handleLogout} />
      </div>
    )

  return <Button onClick={handleLogin} title="Login with Passport" />
}
