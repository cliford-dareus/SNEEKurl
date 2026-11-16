import React, { useMemo, useState } from "react";
import { useAppSelector } from "../app/hook";
import { useRetrieveSubscriptionQuery } from "../app/services/stripe";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "./ui/Input";
import { Button } from "./ui/button";
import ChangePasswordSection from "./modals/change-password-section";
import ChangeProfileImageModal from "./modals/change-profile-image-modal";
import { useUpdateUserDetailsMutation } from "../app/services/user";
import { selectCurrentUser } from "../features/auth/authslice";
import {
  LuUser,
  LuMail,
  LuShield,
  LuCamera,
  LuTrash2,
  LuSave,
  LuCalendar,
  LuCrown,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DeleteAccountModal from "./modals/delete-account-modal";
import { useGetUserAnalyticsQuery } from "../app/services/urlapi";

export type Profile = {
  username: string;
  email: string;
  oldpassword: string;
  newpassword: string;
};

const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data } = useRetrieveSubscriptionQuery(
    { username: user.user.username },
    { skip: !user.user.username }
  );
  const plan = data?.subscription?.data[0]?.plan.metadata.name ?? "free";
  const { data: userAnalytics } = useGetUserAnalyticsQuery("30d");
  const [editProfileActive, setEditProfileActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();

  const totalClicks = useMemo(() => {
    return userAnalytics?.analytics?.overview?.totalClicks || 0;
  }, [userAnalytics]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<Profile>({
    defaultValues: {
      username: user.user.username,
      email: user.user.email,
      oldpassword: "",
      newpassword: "",
    },
  });

  const handleChangeprofiledetails: SubmitHandler<Profile> = async (
    dataform: Profile
  ) => {
    try {
      await updateUserDetails({
        username: dataform.username,
        email: dataform.email,
        oldpassword: dataform.oldpassword,
        newpassword: dataform.newpassword,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-6 pb-8">
        {/* Profile Header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="size-20 overflow-hidden rounded-full border-2 border-border bg-muted">
                <img
                  src={`https://utfs.io/f/ffcca2f3-d293-4543-824a-aa752d3fd536_th.jpg`}
                  alt="Profile"
                  className="size-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setEditProfileActive(true)}
                className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Change photo"
              >
                <LuCamera size={13} />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  {user.user.username}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <LuCrown size={12} />
                  {plan?.charAt(0).toUpperCase() + plan?.slice(1) || "Free"}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {user.user.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <LuCalendar size={12} />
                  Member since {new Date().getFullYear()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <LuShield size={12} />
                  {user.user.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Links created</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {userAnalytics?.analytics?.overview?.totalLinks || 0}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total clicks</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {totalClicks}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Current plan</p>
            <p className="mt-1 text-2xl font-semibold capitalize text-foreground">
              {plan}
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Profile settings
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your account information
              </p>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit profile"}
            </Button>
          </div>

          <form
            onSubmit={handleSubmit(handleChangeprofiledetails)}
            className="space-y-5 p-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <LuUser size={14} className="text-muted-foreground" />
                  Username
                </label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your username"
                      disabled={!isEditing}
                    />
                  )}
                />
                {errors.username && (
                  <p className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <LuMail size={14} className="text-muted-foreground" />
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      disabled={!isEditing}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <LuShield size={16} className="text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">
                    Change password
                  </h3>
                </div>
                <ChangePasswordSection
                  register={register}
                  control={control}
                  setvalue={setValue}
                />
              </div>
            )}

            {isEditing && (
              <div className="flex items-center gap-2 border-t border-border pt-4">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!isDirty || isLoading}
                  className="gap-1.5"
                >
                  <LuSave size={14} />
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Danger Zone */}
        <div className="overflow-hidden rounded-xl border border-destructive/20 bg-card">
          <div className="border-b border-destructive/10 bg-destructive/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <LuTrash2 size={16} className="text-destructive" />
              <div>
                <h3 className="text-sm font-semibold text-destructive">
                  Danger zone
                </h3>
                <p className="text-xs text-muted-foreground">
                  Irreversible actions
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Delete account
              </h4>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>

      <ChangeProfileImageModal
        editProfileActive={editProfileActive}
        setEditProfileActive={setEditProfileActive}
      />
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
      />
    </>
  );
};

export default Profile;
