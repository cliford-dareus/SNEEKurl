import React from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { IFormValues } from "./urlform";
import { useShortenUrlMutation } from "../../app/services/urlapi";
import { useForm } from "react-hook-form";

const HomeCreateLinkManager = React.memo(
  ({ isAuthenticated, isFreePlan }: any) => {
    const [shortenFn] = useShortenUrlMutation();
    const [open, setOpen] = React.useState(false);
    const formMethods = useForm<IFormValues>();

    const handleSubmit = React.useCallback(
      async (data: IFormValues) => {
        if (data.long !== "") {
          shortenFn({ longUrl: data.long });
          formMethods.reset({ long: "" });
        }
      },
      [shortenFn, formMethods]
    );

    return (
      <div
        className="w-full"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <form
          className="flex-1 flex gap-4"
          onSubmit={formMethods.handleSubmit(handleSubmit)}
        >
          <Input
            hidden={false}
            label="long"
            register={formMethods.register}
            placeholder="https://example.com"
            type="url"
          />
          {open && <Button>Create</Button>}
        </form>
      </div>
    );
  }
);

export default HomeCreateLinkManager;
