import {
  passport,
  PassportUserCtx,
  PassportUserSetCtx
} from '@/providers/passport'
import { useContext } from 'react'
import Button from './themed/button'
import Image from 'next/image'
import ImxLogo from '#/imx-icon.svg'
import PowerOffIcon from '#/power-off-icon.svg'
export default function PassportButton() {
  const passportUser = useContext(PassportUserCtx)
  const passportUserSet = useContext(PassportUserSetCtx)
  const handleLogin = async () => {
    const user = await passport.login()
    if (user) {
      const provider = passport.connectEvm()
      const rpcResponse: any = await provider.send({
        method: 'eth_requestAccounts'
      })

      passportUserSet?.({ ...user, address: rpcResponse.result[0] })
    }
  }
  const handleLogout = () => {
    passport.logout()
  }

  if (passportUser === undefined) return null

  if (passportUser)
    return (
      <div
        title="Disconnect"
        onClick={handleLogout}
        className="flex gap-2 items-center rounded-full px-4 py-1.5 bg-white/10 border border-white/10 cursor-pointer"
      >
        <Image src={ImxLogo} width={30} height={30} alt="immutable passport" />
        <span className="text-white text-sm">{`${passportUser.address?.slice(0, 4)}...${passportUser.address?.slice(-4)}`}</span>
        <Image src={PowerOffIcon} width={20} height={20} alt="logout" />
      </div>
    )

  return <Button onClick={handleLogin} title="Connect Immutable Passport" />
}
