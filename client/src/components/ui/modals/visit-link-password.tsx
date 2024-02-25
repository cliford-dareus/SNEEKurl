import React, { Dispatch, SetStateAction, useState } from "react";
import { Url } from "../../../app/services/urlapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { Sheet, SheetContent } from "../sheet";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import Button from "../button";

type Props = {
  status: boolean;
  url: Url | null;
  setStatus: Dispatch<SetStateAction<{ status: boolean; url: Url | null }>>;
};

const VisitLinkPassword = ({ status, url, setStatus }: Props) => {
  const { register, handleSubmit, reset } = useForm<{ password: "" }>();

  const onsubmit: SubmitHandler<{ password: string }> = async (formdata) => {
    const { password } = formdata;
    window.open(
      `http://localhost:4080/short/${url?.short}?password=${password}`
    );
  };

  return (
    <>
      {status && (
        <>
          <Sheet triggerFn={() => setStatus({ status: false, url: null })} />
          <SheetContent classnames="bg-red-600 top-[50%] left-[50%] fixed -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className=" h-full relative">
              <div className="w-full p-4 fixed top-0 left-0 right-0 bg-slate-200 rounded-tr-lg rounded-tl-lg flex flex-col justify-center items-center">
                <img
                  src={`http://www.google.com/s2/favicons?domain=${getSiteUrl(
                    url?.longUrl
                  )}`}
                  className="w-[30px]"
                  alt=""
                />
                <p>sneek.co/{url?.short}</p>
              </div>

              <form
                className="flex h-full pt-20 p-4 gap-4 mt-4"
                onSubmit={handleSubmit(onsubmit)}
              >
                <input {...register("password")} className='w-full rounded-full text-black py-1 px-4 border border-slate-200'/>
                <Button type="submit">Submit</Button>
              </form>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default VisitLinkPassword;
