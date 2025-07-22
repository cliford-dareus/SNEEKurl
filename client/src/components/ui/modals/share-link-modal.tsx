import { useForm } from "react-hook-form";
import Input from "../Input";
import { Sheet, SheetContent } from "../sheet";
import { Dispatch, SetStateAction } from "react";
import { Url } from "../../../app/services/urlapi";
import { getSiteUrl } from "../../../Utils/getSiteUrl";
import Button from "../button";
import { LuFacebook, LuTwitter, LuLinkedin, LuInstagram, LuCopy, LuMail } from "react-icons/lu";
import { toast } from "react-toastify";

type Props = {
  shareActive: boolean;
  setShareActive: Dispatch<SetStateAction<boolean>>;
  url: Url;
};

const ShareLinkModal = ({ shareActive, setShareActive, url }: Props) => {
  const { register, reset, handleSubmit } = useForm<{ email: string }>();

  const shareUrl = `https://sneek.co/${url.short}`;
  const shareText = `Check out this link: ${shareUrl}`;

  const handleShareLink = async (data: { email: string }) => {
    if (!data.email) {
      toast.error("Please enter an email address");
      return;
    }

    // Create mailto link
    const subject = encodeURIComponent("Check out this link");
    const body = encodeURIComponent(`I thought you might be interested in this: ${shareUrl}`);
    const mailtoLink = `mailto:${data.email}?subject=${subject}&body=${body}`;

    window.open(mailtoLink);
    toast.success("Email client opened");
    reset();
  };

  const handleSocialShare = (platform: string) => {
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, so copy to clipboard
        handleCopyToClipboard();
        toast.info("Link copied! Paste it in your Instagram post or story");
        return;
      default:
        return;
    }

    window.open(shareLink, "_blank", "width=600,height=400");
    toast.success(`Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <>
      {shareActive && (
        <>
          <Sheet triggerFn={setShareActive} />
          <SheetContent classnames="top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%] rounded-lg bg-base-200">
            <div className="relative p-4 w-[500px]">
              <div className="fixed top-0 right-0 left-0 flex w-full flex-col items-center justify-center rounded-tl-lg rounded-tr-lg bg-base-300 p-4">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                    url.longUrl
                  )}`}
                  className="w-[30px]"
                  alt=""
                />
                <p>Sharing sneek.co/{url.short}</p>
              </div>

              <div className="pt-20">
                <h2 className="font-bold text-center mb-4">
                  Share Link with friends
                </h2>

                {/* Copy Link Section */}
                <div className="mb-6 p-4 bg-base-100 rounded-lg border border-base-300">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 input input-sm bg-base-200 text-sm"
                    />
                    <Button
                      onClick={handleCopyToClipboard}
                      classnames="btn-sm bg-primary text-white"
                    >
                      <LuCopy size={16} />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Email Share */}
                <form onSubmit={handleSubmit(handleShareLink)} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 input input-sm bg-base-100"
                      {...register("email")}
                      placeholder="friend@example.com"
                      type="email"
                    />
                    <Button type="submit" classnames="btn-sm bg-secondary text-white">
                      <LuMail size={16} />
                      Email
                    </Button>
                  </div>
                </form>

                <div className="my-4 border-t border-base-300 py-4 text-center">
                  <span className="text-sm text-base-content">Or share on social media</span>
                </div>

                {/* Social Media Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleSocialShare("facebook")}
                    classnames="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    <LuFacebook size={18} />
                    Facebook
                  </Button>

                  <Button
                    onClick={() => handleSocialShare("twitter")}
                    classnames="bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
                  >
                    <LuTwitter size={18} />
                    Twitter/X
                  </Button>

                  <Button
                    onClick={() => handleSocialShare("linkedin")}
                    classnames="bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-2"
                  >
                    <LuLinkedin size={18} />
                    LinkedIn
                  </Button>

                  <Button
                    onClick={() => handleSocialShare("instagram")}
                    classnames="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center gap-2"
                  >
                    <LuInstagram size={18} />
                    Instagram
                  </Button>
                </div>

                {/* Close Button */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShareActive(false)}
                    classnames="btn-sm bg-base-300 text-base-content"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </>
      )}
    </>
  );
};

export default ShareLinkModal;
