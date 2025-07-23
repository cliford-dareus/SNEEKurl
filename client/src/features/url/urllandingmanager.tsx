import { IFormValues } from "./urlform";
import { Controller, useForm } from "react-hook-form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import React, { useEffect, useRef } from "react";
import { useShortenUrlMutation } from "../../app/services/urlapi";
import { motion, AnimatePresence, useAnimate, usePresence } from "framer-motion";
import { toast } from "react-toastify";

const HomeCreateLinkManager = React.memo(
  ({ isAuthenticated, isFreePlan }: any) => {
    const [shortenFn] = useShortenUrlMutation();
    const [open, setOpen] = React.useState(false);

    const formMethods = useForm<IFormValues>({
      defaultValues: {
        long: ""
      }
    });

    const handleSubmit = React.useCallback(
      async (data: IFormValues) => {
        try {
          if (data.long !== "") {
            await shortenFn({ longUrl: data.long }).unwrap();
            formMethods.reset({ long: "" });
            toast.success("Link created successfully");
          }
        } catch (error) {
          toast.error("Link creation failed");
        }
      },
      [shortenFn, formMethods]
    );

    return (
      <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="flex items-center gap-2 bg-base-100 rounded-full p-2 shadow-lg">
        <svg className="h-[1em] opacity-50 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </g>
        </svg>

        <Controller
          name="long"
          control={formMethods.control}
          rules={{
            required: "URL is required",
            pattern: {
              value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
              message: "Please enter a valid URL"
            }
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              className="border-none outline-none bg-transparent flex-1"
              placeholder="https://example.com/very-long-url"
              error={fieldState.error?.message}
            />
          )}
        />

        <Button
          type="submit"
          classnames="bg-primary text-white rounded-full px-6"
        >
          Shorten
        </Button>
      </form>
    );
  }
);

HomeCreateLinkManager.displayName = "HomeCreateLinkManager";

export default HomeCreateLinkManager;
