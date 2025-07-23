import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import { Url, useEditUrlMutation } from "../../../app/services/urlapi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import Button from "../button";
import Switch from "../switch";
import PasswordEditSection from "./password-edit-section";
import Label from "../label";
import { useAppSelector } from "../../../app/hook";
import { selectCurrentUser } from "../../../features/auth/authslice";
import { toast } from "react-toastify";

type Props = {
  url: Url;
  editActive: boolean;
  setEditActive: Dispatch<SetStateAction<boolean>>;
  plan: string;
};

const EditLinkModal = ({ url, editActive, setEditActive, plan }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: url,
  });
  const user = useAppSelector(selectCurrentUser);
  const [shareable, setIsShareable] = useState(url.isShareable);
  const [editShort, { isLoading, isError }] = useEditUrlMutation();

  const handleLinkUpdate: SubmitHandler<Url> = async (formData) => {
    const { longUrl, _id, short, favorite, password, isShareable } = formData;
    if (!(user.user.username !== "Guest" && plan !== "free")) {
      return;
    }
    try {
      await editShort({
        id: _id,
        longUrl,
        short,
        favorite,
        password,
        isShareable,
      }).unwrap();
      toast.success("Link updated successfully");
      setEditActive(false);
    } catch (error) {
      toast.error("Link update failed");
    }
  };

  return (
    <Dialog open={editActive} onOpenChange={setEditActive}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src={`http://www.google.com/s2/favicons?domain=${getSiteUrl(url.longUrl)}`}
              className="w-8 h-8 rounded"
              alt="Site favicon"
            />
            <div>
              <DialogTitle>Edit Link</DialogTitle>
              <DialogDescription>
                Editing sneek.co/{url.short}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <form
            onSubmit={handleSubmit(handleLinkUpdate)}
          >
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
                    name="short"
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

              <div className="my-4 border-t border-b border-base-300 py-4 text-center">
                Optionals
              </div>

              <PasswordEditSection
                control={control}
                password={url.password!}
                setvalue={setValue}
                plan={plan}
              />
              <div className="flex items-center justify-between">
                <p>isShareale</p>
                <Switch
                  label="isShareable"
                  register={register}
                  isChecked={shareable}
                  fn={setIsShareable}
                  disabled={
                    !(user.user.username !== "Guest" && plan !== "free")
                  }
                />
              </div>
            </div>

          </form>
        </div>
            <DialogFooter className="space-y-4">
                <Button
                    // variant="outline"
                    onClick={() => setEditActive(false)}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={!(user.user.username !== undefined && plan !== "free")}
                    classnames="bg-primary text-primary-content"
                >
                    Save Changes
                </Button>
            </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default EditLinkModal;
