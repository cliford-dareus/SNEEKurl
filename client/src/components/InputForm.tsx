import { ChangeEventHandler } from "react";


interface IProps {
    placeholder: string;
    type: string;
    name: string;
    value: string;
    fn: ChangeEventHandler
}

const InputForm = ({ name, value, fn, placeholder,type }: IProps) => {
  return (
    <div className='flex flex-col mt-1'>
        <label 
            htmlFor=""
            className='text-white mb-2'
        >
            {placeholder}
        </label>

        <input 
            placeholder= {placeholder}
            name= {name}
            value={value}
            type={type} 
            className='w-full outline-none bg-blue-800 py-2 px-4 rounded-md text-white'
            onChange={fn}
        />
    </div>
  )
}

export default InputForm;