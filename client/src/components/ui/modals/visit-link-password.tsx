import React, { Dispatch, SetStateAction, useState } from "react";
import { Url } from "../../../app/services/urlapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { Sheet, SheetContent } from "../sheet";

type Props = {
  status: boolean;
  url: Url | null;
  setStatus: Dispatch<SetStateAction<{ status: boolean; url: Url | null }>>;
};

const VisitLinkPassword = ({ status, url, setStatus }: Props) => {
  const { register, handleSubmit, reset } = useForm<{ password: "" }>();

  const onsubmit: SubmitHandler<{ password: string }> = async (formdata) => {
    const { password } = formdata;
    const res = await fetch(
      `http://localhost:4080/short/${url?.short}?password=${password}`
    ).then((res) => {
      if (res.redirected) {
        window.open(res.url, "_blank");
      }
    });
  };
  return (
    <>
      {status && (
        <>
          <Sheet triggerFn={() => setStatus({ status: false, url: null })} />
          <SheetContent classnames="bg-red-600 top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className="absolute bg-red-500 w-40 h-40">
              <h1>Enter Password</h1>
              <form onSubmit={handleSubmit(onsubmit)}>
                <input {...register("password")} />
                <button type="submit">Submit</button>
              </form>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default VisitLinkPassword;
