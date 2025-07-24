import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import Button from "../button";
import Input from "../Input";
import { Controller, useForm } from "react-hook-form";
import { LuTrash2, LuAlertTriangle, LuX } from "react-icons/lu";
import { useDeleteUserAccountMutation } from "../../../app/services/user";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { removeCredentials, selectCurrentUser } from "../../../features/auth/authslice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

type DeleteForm = {
  confirmText: string;
  password: string;
};

const DeleteAccountModal = ({ isOpen, setIsOpen }: Props) => {
  const [step, setStep] = useState(1);
  const [deleteAccount, { isLoading }] = useDeleteUserAccountMutation();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { handleSubmit, control, watch, formState: { errors }, reset } = useForm<DeleteForm>();

  const confirmText = watch("confirmText");
  const isConfirmTextValid = confirmText === "DELETE";

  const handleDeleteAccount = async (data: DeleteForm) => {
    if (!isConfirmTextValid) {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteAccount({ password: data.password }).unwrap();

      // Clear user session
      dispatch(removeCredentials());

      // Show success message
      toast.success("Account deleted successfully");

      // Redirect to home page
      navigate("/");

      // Close modal
      setIsOpen(false);
      reset();
      setStep(1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete account");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <LuTrash2 className="text-error" size={20} />
            </div>
            <div>
              <DialogTitle className="text-error">Delete Account</DialogTitle>
              <DialogDescription>This action cannot be undone</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {step === 1 && (
            <div className="space-y-6">
              {/* Warning */}
              <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <LuAlertTriangle className="text-error mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium text-error mb-2">Warning</h3>
                    <p className="text-sm text-base-content/80">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="text-sm text-base-content/80 mt-2 space-y-1 ml-4">
                      <li>• All your shortened links</li>
                      <li>• All link analytics and statistics</li>
                      <li>• Your custom pages and bio links</li>
                      <li>• Your subscription (if active)</li>
                      <li>• All account data and settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-base-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Account to be deleted:</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                    {user.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.user.username}</p>
                    <p className="text-sm text-base-content/70">{user.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(handleDeleteAccount)} className="space-y-6">
              {/* Final Confirmation */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type <span className="font-bold text-error">DELETE</span> to confirm:
                  </label>
                  <Controller
                    name="confirmText"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="Type DELETE here"
                        className={`${isConfirmTextValid ? 'border-success' : 'border-error'}`}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  {confirmText && !isConfirmTextValid && (
                    <p className="text-error text-sm mt-1">Please type "DELETE" exactly</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your password to confirm:
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        placeholder="Enter your password"
                        type="password"
                        className="border-base-300"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-error text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Final Warning */}
              <div className="bg-error/10 border border-error/30 rounded-lg p-4">
                <p className="text-sm text-error font-medium">
                  ⚠️ This action is permanent and cannot be reversed
                </p>
              </div>
            </form>
          )}
        </div>

        <DialogFooter>
          {step === 1 && (
            <>
              <Button
                onClick={handleClose}
                classnames="bg-base-300 text-base-content"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                classnames="bg-error text-white hover:bg-error-focus"
              >
                Continue to Delete
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button
                type="button"
                onClick={() => setStep(1)}
                classnames="bg-base-300 text-base-content"
              >
                Back
              </Button>
              <Button
                disabled={!isConfirmTextValid || isLoading}
                classnames="bg-error text-white hover:bg-error-focus disabled:opacity-50"
                onClick={handleSubmit(handleDeleteAccount)}
              >
                {isLoading ? "Deleting Account..." : "Delete My Account"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
