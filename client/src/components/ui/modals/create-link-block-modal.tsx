import React from "react";
import { Sheet, SheetContent } from "../sheet";
import { useForm } from "react-hook-form";
import MultiSelect from "../multi-select";
import { CreateLinkInBioProp } from "./create-link-in-bio-modal";

type Props = {
  createLinkBlockActive: boolean;
  setCreateLinkBlockActive: React.Dispatch<React.SetStateAction<boolean>>;
};

interface CreateLinkBlockProp extends CreateLinkInBioProp  {
    links: string[];
}

const CreateLinkBlockModal = ({
  createLinkBlockActive,
  setCreateLinkBlockActive,
}: Props) => {

  const { register, handleSubmit, setValue } = useForm<CreateLinkBlockProp>();
  const handleCreateLinkBlock = async () => {};

  return (
    <>
      {createLinkBlockActive && (
        <>
          <Sheet triggerFn={setCreateLinkBlockActive} />
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
                onSubmit={handleSubmit(handleCreateLinkBlock)}
              >
                <MultiSelect setvalues={setValue} />
              </form>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default CreateLinkBlockModal;
