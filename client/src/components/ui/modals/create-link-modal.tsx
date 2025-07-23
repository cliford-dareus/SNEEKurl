import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import Label from "../label";
import Input from "../Input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Button from "../button";
import { useShortenUrlMutation } from "../../../app/services/urlapi";
import { toast } from "react-toastify";

type Props = {
  setAddLinkActive: Dispatch<SetStateAction<boolean>>;
  addLinkActive: boolean;
};

type CreateLinkProp = {
  longUrl: string;
  "back-half": string;
  password: string;
};
const CreateLinkModal = ({ addLinkActive, setAddLinkActive }: Props) => {
  const [attemptShort] = useShortenUrlMutation();
  const { control, handleSubmit, reset } = useForm<CreateLinkProp>();

  const handleCreateLink: SubmitHandler<CreateLinkProp> = async (dataform) => {
    try {
      await attemptShort(dataform).unwrap();
      toast.success("Link created successfully");
      setAddLinkActive(false);
      reset();
    } catch (e) {
        if (typeof e === "object" && e !== null && "status" in e && (e as any).status === 402) {
            toast.error("Please upgrade your plan to create more links");
            return;
        }
      toast.error("Link creation failed");
    }
  };

  return (
    <Dialog open={addLinkActive} onOpenChange={setAddLinkActive}>
      <DialogContent
        size="lg"
        className="bg-base-100"
        closeOnOutsideClick={true}
        closeOnEscape={true}
        position="center"
      >
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
          <form onSubmit={handleSubmit(handleCreateLink)} className="space-y-4">
            <div className="flex flex-col gap-4 pt-8">
              <div>
                <Label>Destination Url</Label>
                <Controller
                  name="longUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="https://"
                      pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                      title="Must be valid URL"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Label>Short Url</Label>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-accent px-2 py-1">
                    sneek.co/
                  </div>
                  <Controller
                    name="back-half"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="Enter a back-half(Optional)"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setAddLinkActive(false)}
            classnames="bg-base-300 text-base-content"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleCreateLink)}
            type="submit"
            classnames="bg-primary text-primary-content"
          >
            Create Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLinkModal;
