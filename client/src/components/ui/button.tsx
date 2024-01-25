import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const Button = ({children}: Props) => {
  return (
    <button className="unset px-4 py-1 flex justify-center items-center bg-red-500 rounded-full">{children}</button>
  )
}

export default Button