import React, { Dispatch, SetStateAction, useState } from "react";
import { Sheet, SheetContent } from "../sheet";
import Label from "../label";
import Input from "../Input";
import Button from "../button";
import Switch from "../switch";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreatePageMutation } from "../../../app/services/page";

type Props = {
  createLinkInBioActive: boolean;
  setCreateLinkInBioActive: Dispatch<SetStateAction<boolean>>;
};

export type CreateLinkInBioProp = {
  title: string;
  description: string;
  slug: string;
  public: boolean;
};
const CreateLinkInBioModal = ({
  createLinkInBioActive,
  setCreateLinkInBioActive,
}: Props) => {
  const [createLinkInBio] = useCreatePageMutation();
  const [isChecked, setChecked] = useState(false);
  const { register, handleSubmit } = useForm<CreateLinkInBioProp>();

  const handleCreateLinkInBio: SubmitHandler<CreateLinkInBioProp> = async (
    dataform
  ) => {
    try {
      await createLinkInBio(dataform);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {createLinkInBioActive && (
        <>
          <Sheet triggerFn={setCreateLinkInBioActive} />
          <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className="relative h-full w-[500px]">
              <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-slate-200 p-4">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 200 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                    fill="black"
                  />
                </svg>
                <p>Creating Page</p>
              </div>

              <form
                action=""
                className="h-full p-4 pt-20"
                onSubmit={handleSubmit(handleCreateLinkInBio)}
              >
                <div className="flex flex-col gap-4 pt-8">
                  <div>
                    <Label>Title</Label>
                    <Input
                      register={register}
                      placeholder=""
                      label="title"
                      hidden={false}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      register={register}
                      placeholder=""
                      label="description"
                      hidden={false}
                    />
                  </div>

                  <div>
                    <Label>Slug</Label>
                    <Input
                      register={register}
                      placeholder=""
                      label="slug"
                      hidden={false}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p>Public</p>
                    <Switch
                      isChecked={isChecked}
                      fn={setChecked}
                      label={"public"}
                      register={register}
                    />
                  </div>
                  <Button classnames="self-start">Create</Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default CreateLinkInBioModal;
