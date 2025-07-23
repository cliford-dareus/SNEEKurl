import React, { Dispatch, SetStateAction, useState } from "react";
import { Sheet, SheetContent } from "../sheet";
import Label from "../label";
import Input from "../Input";
import Button from "../button";
import Switch from "../switch";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCreatePageMutation } from "../../../app/services/page";
import { toast } from "react-toastify";
import Dialog, { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../dialog";

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
  const { register, handleSubmit, reset, control } = useForm<CreateLinkInBioProp>();

  const handleCreateLinkInBio: SubmitHandler<CreateLinkInBioProp> = async (
    dataform
  ) => {
    try {
      await createLinkInBio(dataform).unwrap();
      toast.success("Page created successfully");
      setCreateLinkInBioActive(false);
      reset();
    } catch (e) {
      toast.error("Page creation failed");
      console.log(e);
    }
  };

  return (
    <>
      {createLinkInBioActive && (
        <>
          <Dialog open={createLinkInBioActive} onOpenChange={setCreateLinkInBioActive}>
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
              <form onSubmit={handleSubmit(handleCreateLinkInBio)}>
                <div className="flex flex-col gap-4 pt-8">
                  <div>
                    <Label>Title</Label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter a title"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter a description"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label>Slug</Label>
                    <Controller
                      name="slug"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter a slug"
                        />
                        )}
                    />
                  </div>

                  <div>
                    <Label>Slug</Label>
                    <Controller
                      name="slug"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter a slug"
                        />
                      )}
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
                  <Button classnames="self-start bg-primary">Create</Button>
                </div>
              </form>
              </div>
          </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CreateLinkInBioModal;
