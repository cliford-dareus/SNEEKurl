import { useState } from 'react';

const UrlModal = (props: any) => {
  
  console.log(props.data)
  return (
    <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10/12 h-2/5 bg-blue-800 rounded-md shadow-md p-4 lg:translate-x-1/2 lg:w-1/2 lg:right-0 lg:h-4/6 '>
      <h2 onClick={()=> props.close()}>helle</h2>
    </div>
  )
}

export default UrlModal;