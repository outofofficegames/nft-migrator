import { useAccount, useDisconnect } from 'wagmi'
import Button from './themed/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Image from 'next/image'
import WcLogo from '#/wc-icon.png'
import PowerOffIcon from '#/power-off-icon.svg'

export default function WalletConnectButton() {
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()
  const handleConnect = () => open()
  const handleDisconnect = () => disconnect()

  if (account.isConnecting || account.isReconnecting) return null

  if (account.isConnected)
    return (
      <div
        onClick={handleDisconnect}
        title="Disconnect"
        className="flex gap-2 items-center rounded-full px-4 py-1.5 bg-white border border-white/10 cursor-pointer relative"
      >
        <Image src={WcLogo} width={30} height={30} alt="immutable passport" />
        <span className="text-[#00126D] text-sm">
          {`${account.address.slice(0, 4)}...${account.address.slice(-4)}`}
        </span>
        <Image src={PowerOffIcon} width={20} height={20} alt="logout" />
        <div className="bg-[#00126D] absolute z-[-1] left-2 -right-2 top-2 -bottom-2 rounded-full" />
      </div>
    )

  return <Button onClick={handleConnect} title="Connect EOA Wallet" />
}
