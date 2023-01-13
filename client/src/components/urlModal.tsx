import { useState, useEffect } from 'react';
import { Site } from '../types/types';
import { getSiteUrl } from '../Utils/getSiteUrl';

const UrlModal = (props: {data: Site | undefined ; close: any}) => {
  const [ site, setSite ] = useState<string>();
 
  useEffect(() => {
    const Site = getSiteUrl(props.data?.full);
    setSite(Site)
  },[props.data])
  
  return (
    <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10/12 h-2/5 bg-blue-800 rounded-md shadow-md p-4 lg:translate-x-1/2 lg:w-1/2 lg:right-0 lg:h-4/6 '>
      <img src={`https://icons.duckduckgo.com/ip2/${site}.ico`} alt="" loading='lazy' width='50px'/>
      <h2 onClick={()=> props.close()}>helle</h2>
    </div>
  )
}

export default UrlModal;