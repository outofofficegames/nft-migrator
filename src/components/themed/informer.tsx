import Image from 'next/image'
import ExcIcon from '#/exclimation-icon.svg'
export default function Informer({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center min-h-10 p-4 flex-col gap-4">
      <Image src={ExcIcon} width={30} height={30} alt="alert" />
      <p className=" font-russo text-center text-white ">{text}</p>
    </div>
  )
}
