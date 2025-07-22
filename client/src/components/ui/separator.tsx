import React from 'react';
import classNames from "classnames";

type Props = {
    classnames?: string;
}
const Separator = ({classnames}: Props) => {
    return(
        <div className={classNames('h-1 border-b border-base-200 my-4', classnames)} />
    )
};

export default Separator;
