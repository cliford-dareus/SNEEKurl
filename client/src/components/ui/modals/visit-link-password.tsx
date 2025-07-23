import React, { Dispatch, SetStateAction, useState } from "react";
import { Url } from "../../../app/services/urlapi";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../dialog";
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

  const handledSetStatus = (newStatus: boolean) => {
    setStatus({ status: newStatus, url: url });
  };

  return (
    <>
      {status && (
        <>
          <Dialog open={status} onOpenChange={handledSetStatus} />
          <DialogContent>
             <DialogHeader>
                        <div className="flex items-center gap-3">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 200 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                              fill="currentColor"
                            />
                          </svg>
                          <div>
                            <DialogTitle>Create New Link</DialogTitle>
                            <DialogDescription>Shorten your URL and customize it</DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
            <div className="px-6 py-4">
              <form
                className="mt-4 flex h-full gap-4 p-4 pt-20"
                onSubmit={handleSubmit(onsubmit)}
              >
                <input {...register("password")} className='w-full rounded-full border border-base-300 px-4 py-1 text-black'/>
                <Button classnames="bg-primary" type="submit">Submit</Button>
              </form>
            </div>
          </DialogContent>
        </>
      )}
    </>
  );
};

export default VisitLinkPassword;
