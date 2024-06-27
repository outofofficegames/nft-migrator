import clsx from 'clsx'
import { HTMLAttributes } from 'react'

interface StrokedTextProps
  extends HTMLAttributes<HTMLHeadingElement>,
    HTMLAttributes<HTMLParagraphElement> {
  content?: string
  var: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}
export default function StrokedText({ content, ...props }: StrokedTextProps) {
  return (
    <div className="relative pr-[0.6rem]">
      <props.var {...props} className={clsx(props.className, 'text-white')}>
        {content || props.children}
        <span
          className={clsx(
            props.className,

            'absolute  inset-[0.3rem] text-[#00126D] z-[-1]'
          )}
        >
          {content || props.children}
        </span>
      </props.var>
    </div>
  )
}
