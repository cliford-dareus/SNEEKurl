import React, { useState } from "react";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { useRetrieveSubscriptionQuery } from "../app/services/stripe";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/button";
import ChangePasswordSection from "./ui/modals/change-password-section";
import Separator from "./ui/separator";
import Portal from "./portal";
import ChangeProfileImageModal from "./ui/modals/change-profile-image-modal";
import { useUpdateUserDetailsMutation } from "../app/services/user";
import { selectCurrentUser } from "../features/auth/authslice";
import { LuUser, LuMail, LuShield, LuCamera, LuTrash2, LuSave, LuCalendar, LuCrown, LuSettings } from "react-icons/lu";
import { toast } from "react-toastify";
import DeleteAccountModal from "./ui/modals/delete-account-modal";

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
  const [editProfileActive, setEditProfileActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();

  const { register, handleSubmit, setValue, control, formState: { errors, isDirty } } = useForm<Profile>({
    defaultValues: {
      username: user.user.username,
      email: user.user.email,
      oldpassword: "",
      newpassword: "",
    },
  });

  const handleChangeprofiledetails: SubmitHandler<Profile> = async (
    dataform: Profile,
  ) => {
    try {
      const updatedUser = await updateUserDetails({
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

  const getPlanBadgeColor = (planName: string) => {
    switch (planName?.toLowerCase()) {
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-blue-500';
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  console.log(data);

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary ring-4 ring-primary/20 overflow-hidden">
                <img
                  src={`https://utfs.io/f/ffcca2f3-d293-4543-824a-aa752d3fd536_th.jpg`}
                  alt="profile image"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setEditProfileActive(true)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-focus transition-colors"
              >
                <LuCamera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-base-content">
                  {user.user.username}
                </h1>
                <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getPlanBadgeColor(plan)}`}>
                  <div className="flex items-center gap-1">
                    <LuCrown size={14} />
                    {plan?.charAt(0).toUpperCase() + plan?.slice(1) || 'Free'}
                  </div>
                </div>
              </div>
              <p className="text-base-content/70 mb-3">{user.user.email}</p>
              <div className="flex items-center gap-4 text-sm text-base-content/60">
                <div className="flex items-center gap-1">
                  <LuCalendar size={14} />
                  Member since {new Date().getFullYear()}
                </div>
                <div className="flex items-center gap-1">
                  <LuShield size={14} />
                  {user.user.isVerified ? 'Verified' : 'Unverified'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LuSettings className="text-primary" size={24} />
                <div>
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  <p className="text-sm text-base-content/70">Manage your account information</p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                classnames={`${isEditing ? 'bg-base-300 text-base-content' : 'bg-primary'} flex items-center gap-2`}
              >
                {/* <LuEdit3 size={16} /> */}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleChangeprofiledetails)} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <LuUser size={16} />
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
                      className={`${!isEditing ? 'bg-base-200' : 'bg-base-100'}`}
                    />
                  )}
                />
                {errors.username && (
                  <p className="text-error text-sm">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <LuMail size={16} />
                  Email Address
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      disabled={!isEditing}
                      className={`${!isEditing ? 'bg-base-200' : 'bg-base-100'}`}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-error text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <LuShield className="text-warning" size={20} />
                  <h3 className="font-medium">Change Password</h3>
                </div>
                <ChangePasswordSection register={register} control={control} setvalue={setValue} />
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center gap-3 pt-4 border-t border-base-300">
                <Button
                  type="submit"
                  disabled={!isDirty || isLoading}
                  classnames="bg-primary text-white flex items-center gap-2 disabled:opacity-50"
                >
                  <LuSave size={16} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  classnames="bg-base-300 text-base-content"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-base-100 rounded-lg border border-base-300 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <LuUser className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-base-content/70">Links Created</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg border border-base-300 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <LuCalendar className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-base-content/70">Total Clicks</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg border border-base-300 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <LuShield className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{plan}</p>
                <p className="text-sm text-base-content/70">Current Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-base-100 rounded-xl border border-error/20 overflow-hidden">
          <div className="p-6 bg-error/5">
            <div className="flex items-center gap-3 mb-4">
              <LuTrash2 className="text-error" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-error">Danger Zone</h3>
                <p className="text-sm text-base-content/70">Irreversible and destructive actions</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg border border-error/20">
              <div>
                <h4 className="font-medium text-base-content">Delete Account</h4>
                <p className="text-sm text-base-content/70">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                onClick={() => setDeleteModalOpen(true)}
                classnames="bg-error text-white hover:bg-error-focus"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Portal>
        <ChangeProfileImageModal
          editProfileActive={editProfileActive}
          setEditProfileActive={setEditProfileActive}
        />
        <DeleteAccountModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
        />
      </Portal>
    </>
  );
};

export default Profile;
