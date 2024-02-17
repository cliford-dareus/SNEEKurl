import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Sheet, SheetContent } from "../sheet";
import { Url, useEditUrlMutation } from "../../../app/services/urlapi";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import Button from "../button";
import Switch from "../switch";
import PasswordEditSection from "./password-edit-section";
import Label from "../label";
import { useRetrieveSubscriptionQuery } from "../../../app/services/stripe";
import { useAppSelector } from "../../../app/hook";
import { selectCurrentUser } from "../../../features/auth/authslice";

const EditLinkModal = ({
  url,
  editActive,
  setEditActive,
}: {
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
  const { data } = useRetrieveSubscriptionQuery();
  const plan = data?.subscription?.data[0].plan.metadata.name;
  const [shareable, setIsShareable] = useState(url.isShareable);
  const [editShort, { isLoading, isError }] = useEditUrlMutation();

  const handleLinkUpdate: SubmitHandler<Url> = async (formData) => {
    const { longUrl, _id,  short, favorite, password, isShareable } =
      formData;
    if (!(user.user.username !== "Guest" && plan !== "free")) return;
    try {
      await editShort({
        id: _id,
        longUrl,
        short,
        favorite,
        password,
        isShareable,
      });
    } catch (error) {}
  };

  return (
    <>
      {editActive && (
        <>
          <Sheet triggerFn={setEditActive} />
          <SheetContent classnames="bg-red-600 top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-slate-100">
            <div className="w-[500px] h-full relative">
              <div className="w-full p-4 fixed top-0 left-0 right-0 bg-slate-200 rounded-tr-lg rounded-tl-lg flex flex-col justify-center items-center">
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
                className="h-full pt-20 p-4 gap-4"
                action=""
                onSubmit={handleSubmit(handleLinkUpdate)}
              >
                <div className="flex flex-col gap-4 mt-4">
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
                      <div className="py-1 px-2 rounded-full bg-white">
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

                  <div className="border-t border-b py-4 my-4 border-slate-200 text-center">
                    Optionals
                  </div>

                  <PasswordEditSection
                    register={register}
                    url={url}
                    setvalue={setValue}
                    plan={plan}
                  />
                  <div className="flex justify-between items-center">
                    <p>isShareale</p>
                    <Switch
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
