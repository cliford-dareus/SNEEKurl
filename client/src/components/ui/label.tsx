import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const Label = ({children}: Props) => {
  return (
    <label>{children}</label>
  )
}

export default Label