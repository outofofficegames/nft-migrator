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
      const provider = passport.connectEvm({ announceProvider: false })
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
        className="flex flex-1 md:flex-none gap-1 md:gap-2 items-center justify-center md:justify-between rounded-full px-3 md:px-4 py-1.5 bg-white border border-white/10 cursor-pointer relative"
      >
        <Image src={ImxLogo} width={30} height={30} alt="immutable passport" />
        <span className="text-[#00126D] text-sm">{`${passportUser.address?.slice(0, 4)}...${passportUser.address?.slice(-4)}`}</span>
        <Image
          className="hidden md:block"
          src={PowerOffIcon}
          width={20}
          height={20}
          alt="logout"
        />
        <div className="bg-[#00126D] absolute z-[-1] left-2 -right-2 top-2 -bottom-2 rounded-full" />
      </div>
    )

  return (
    <Button
      className="flex-1 justify-center"
      onClick={handleLogin}
      title="Connect Immutable Passport"
    />
  )
}
