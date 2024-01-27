import Label from "../../components/ui/label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from "@reduxjs/toolkit/dist/query";
import { UrlRequest, UrlResponse } from "../../app/services/urlapi";

type Props = {
  shortenFn: MutationTrigger<
    MutationDefinition<
      UrlRequest,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      UrlResponse,
      "api"
    >
  >;
};

export type IFormValues = {
  long: string;
  "back-half"?: string;
};

const Urlform = ({ shortenFn }: Props) => {
  const { register, handleSubmit, control, watch } = useForm<
    IFormValues | any
  >();

  const onsubmit: SubmitHandler<IFormValues> = async(data) => {
    if (!data["back-half"]) {
      shortenFn({longUrl: data["long"]});
    }

    shortenFn({ longUrl: data["long"], backhalf: data["back-half"] });
  };

  const input1Value = watch("long");

  return (
    <>
      <form
        className="w-full flex flex-col mt-4 gap-2"
        onSubmit={handleSubmit(onsubmit)}
      >
        <div className="flex flex-col items-start">
          <Label>Paste long Url</Label>
          <Controller
            name="long"
            control={control}
            render={({ field }) => (
              <input
                className="w-full rounded-full text-black py-1 px-4"
                {...field}
              />
            )}
          />
        </div>

        <Button>Generate Short</Button>
      </form>

      <div className="mt-4 bg-white rounded-full aspect-square w-8 mx-auto text-black flex justify-center items-center">
        <span>OR</span>
      </div>

      <form
        className="w-full flex flex-col mt-4 gap-2"
        onSubmit={handleSubmit(onsubmit)}
      >
        <Controller
          name="long2"
          control={control}
          render={({ field }) => (
            <input hidden {...field} value={input1Value} />
          )}
        />

        <div className="flex flex-col items-start">
          <Label>Enter a back-half(Optional)</Label>
          <Input
            register={register}
            label="back-half"
            placeholder="Enter long url..."
            hidden={false}
          />
        </div>

        <Button>Generate custom short</Button>
        <span className="">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </span>
      </form>
    </>
  );
};

export default Urlform;
