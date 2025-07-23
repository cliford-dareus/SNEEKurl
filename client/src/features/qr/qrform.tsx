import React from "react";
import Label from "../../components/ui/label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createQr } from "./qrslice";
import { useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { Select } from "../../components/ui/select";
import { LuLink, LuImage, LuSettings, LuSparkles } from "react-icons/lu";

type Props = {};

export type IQrFormValues = {
  domain: string;
  size: number;
  image: string;
};

const Qrform = (props: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IQrFormValues>({
    defaultValues: {
      domain: "",
      size: 300,
      image: ""
    }
  });

  const dispatch = useDispatch();

  const onsubmit: SubmitHandler<IQrFormValues> = async (data) => {
    dispatch(
      createQr({
        url: data.domain,
        size: Number(data.size),
        logoSrc: data.image || undefined
      })
    );
  };

  return (
    <div className="bg-base-200 rounded-2xl p-6">
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onsubmit)}
      >
        {/* URL Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base-content font-medium">
            <LuLink size={16} />
            QR Code Destination URL
          </Label>
          <Controller
            name="domain"
            control={control}
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
                className="w-full"
                placeholder="https://example.com"
                error={fieldState.error?.message}
              />
            )}
          />
          <p className="text-xs text-base-content/60">
            Enter the URL that your QR code will redirect to
          </p>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base-content font-medium">
            <LuSettings size={16} />
            QR Code Size
          </Label>
          <Select
            className="w-full"
            {...register("size", {
              required: "Please select a size",
              valueAsNumber: true
            })}
          >
            <option value="">Choose size...</option>
            <option value={200}>Small (200x200px)</option>
            <option value={300}>Medium (300x300px)</option>
            <option value={400}>Large (400x400px)</option>
            <option value={500}>Extra Large (500x500px)</option>
          </Select>
          {errors.size && (
            <p className="text-sm text-destructive">{errors.size.message}</p>
          )}
          <p className="text-xs text-base-content/60">
            Larger sizes provide better scanning reliability
          </p>
        </div>

        {/* Logo URL Input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-base-content font-medium">
            <LuImage size={16} />
            Custom Logo (Optional)
          </Label>
          <Controller
            name="image"
            control={control}
            rules={{
              pattern: {
                value: /^(https?:\/\/).*\.(jpg|jpeg|png|gif|svg)$/i,
                message: "Please enter a valid image URL"
              }
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                className="w-full"
                placeholder="https://example.com/logo.png"
                error={fieldState.error?.message}
              />
            )}
          />
          <p className="text-xs text-base-content/60">
            Add your brand logo to the center of the QR code
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          classnames="w-full bg-primary hover:bg-primary/90 text-primary-content justify-center py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-content border-t-transparent" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <LuSparkles size={18} />
              <span>Generate QR Code</span>
            </>
          )}
        </Button>
      </form>

      {/* Features List */}
      <div className="mt-6 pt-6 border-t border-base-300">
        <h3 className="font-medium text-base-content mb-3">✨ Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>High-quality vector output</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Custom logo embedding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Multiple download formats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Mobile-optimized scanning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qrform;
