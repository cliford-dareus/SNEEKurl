import { Dispatch, SetStateAction, useState } from "react";
import { Sheet, SheetContent } from "../sheet";
import { Url, useEditUrlMutation } from "../../../app/services/urlapi";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import Button from "../button";
import Switch from "../switch";
import PasswordEditSection from "./password-edit-section";
import Label from "../label";
import { useAppSelector } from "../../../app/hook";
import { selectCurrentUser } from "../../../features/auth/authslice";
import { toast } from "react-toastify";

const EditLinkModal = ({
  plan,
  url,
  editActive,
  setEditActive,
}: {
  plan: string;
  url: Url;
  editActive: boolean;
  setEditActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
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
    <>
      {editActive && (
        <>
          <Sheet triggerFn={setEditActive} />
          <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100 border border-slate-200">
            <div className="relative h-full w-[500px]">
              <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-slate-200 p-4">
                <img
                  src={`http://www.google.com/s2/favicons?domain=${getSiteUrl(
                    url.longUrl
                  )}`}
                  className="w-[30px]"
                  alt=""
                />
                <p>Editing sneek.co/{url.short}</p>
              </div>

              <form
                className="h-full p-4 pt-20"
                action=""
                onSubmit={handleSubmit(handleLinkUpdate)}
              >
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <Label>Destination Url</Label>
                    <Input
                      register={register}
                      placeholder=""
                      label="longUrl"
                      hidden={false}
                    />
                  </div>

                  <div>
                    <Label>Short Url</Label>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-white px-2 py-1">
                        sneek.co/
                      </div>
                      <Input
                        register={register}
                        placeholder=""
                        label="short"
                        hidden={false}
                      />
                    </div>
                  </div>

                  <div className="my-4 border-t border-b border-slate-200 py-4 text-center">
                    Optionals
                  </div>

                  <PasswordEditSection
                    register={register}
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

                  <Button
                    disabled={!(user.user.username && plan !== "free")}
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default EditLinkModal;
