import classNames from 'classnames'
import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode
    classnames?: string
}

const Popover = ({classnames, children}: Props) => {
  return (
    <div className={classNames(classnames, 'absolute min-w-[200px] p-4 bg-slate-300 rounded-lg top-0 z-20')}>
        {children}
    </div>
  )
}

export default Popover