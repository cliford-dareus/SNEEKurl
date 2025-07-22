import { IFormValues } from "./urlform";
import { useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import React, { useEffect, useRef } from "react";
import { useShortenUrlMutation } from "../../app/services/urlapi";
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";

const Box = ({ children }: { children: React.ReactNode }) => {
  const [ref, animate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      animate(ref.current, {
        opacity: 0,
        display: "none",
        transition: { duration: 0.2 },
      });
    } else {
      animate(ref.current, {
        opacity: 1,
        display: "flex",
        transition: { duration: 0.2 },
      });
    }
  }, [isPresent, safeToRemove]);

  return (
    <div ref={ref} className="">
      {children}
    </div>
  );
};

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
          <AnimatePresence>
            {open && (
              <Box>
                <Button classnames="bg-primary">Create</Button>
              </Box>
            )}
          </AnimatePresence>
        </form>
      </div>
    );
  }
);

export default HomeCreateLinkManager;
