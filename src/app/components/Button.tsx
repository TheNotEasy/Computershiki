import Link from "next/link";
import { forwardRef, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  href: string;
  className?: string;
}>

const Button = forwardRef<HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const {href, className, ...restProps} = props;
  return <Link href={props.href} className={"p-4 bg-primary text-white rounded-[10px] text-[24px] " + className}>
    {props.children}
  </Link>
})

export default Button;

// export default function Button(props: ButtonProps) {
//   return <Link href={props.href} className="p-4 bg-primary text-white rounded-[10px] text-[24px] w-min">
//     {props.children}
//   </Link>
// }