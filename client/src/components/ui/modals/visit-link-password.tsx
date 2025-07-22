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
          <SheetContent classnames="bg-red-600 top-[50%] left-[50%] fixed -translate-x-[50%] -translate-y-[50%] rounded-lg bg-base-200 border border-base-300">
            <div className="relative h-full">
              <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-base-300 p-4">
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
                className="mt-4 flex h-full gap-4 p-4 pt-20"
                onSubmit={handleSubmit(onsubmit)}
              >
                <input {...register("password")} className='w-full rounded-full border border-base-300 px-4 py-1 text-black'/>
                <Button classnames="bg-primary" type="submit">Submit</Button>
              </form>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default VisitLinkPassword;
