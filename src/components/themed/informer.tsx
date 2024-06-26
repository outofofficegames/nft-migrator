import Image from 'next/image'
import ExcIcon from '#/exclimation-icon.svg'
import CheckIcon from '#/check-icon.png'
export default function Informer({
  text,
  type = 'alert'
}: {
  text: string
  type?: 'alert' | 'success'
}) {
  return (
    <div className="flex items-center justify-center min-h-10 p-4 flex-col gap-4">
      <Image
        src={type === 'alert' ? ExcIcon : CheckIcon}
        width={type === 'alert' ? 30 : 60}
        height={30}
        alt={type}
      />
      <p className=" font-russo text-center text-white max-w-sm">{text}</p>
    </div>
  )
}
