import React, { useState } from "react";
import { Url, useDeleteUrlMutation } from "../app/services/urlapi";
import { getSiteUrl } from "../Utils/getSiteUrl";
import VisitLinkButton from "./visit-link-button";
import {
  LuBarChart,
  LuFileEdit,
  LuLink2,
  LuMoreVertical,
  LuQrCode,
  LuTrash2,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import EditLinkModal from "./modals/edit-link-modal";
import EditQrModal from "./modals/edit-qr-modal";
import ShareLinkModal from "./modals/share-link-modal";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";

const LinkCard = ({ url, plan }: { url: Url; plan: string }) => {
  const [editActive, setEditActive] = useState(false);
  const [qrActive, setQrActive] = useState(false);
  const [shareActive, setShareActive] = useState(false);
  const [deleteUrl] = useDeleteUrlMutation();

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:bg-muted/30">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <img
            className="size-5 rounded-sm"
            src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
              url.longUrl
            )}&sz=64`}
            loading="lazy"
            alt=""
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <VisitLinkButton url={url.short}>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                <LuLink2 size={14} className="shrink-0" />
                sneek.co/{url.short}
              </span>
            </VisitLinkButton>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {url.totalClicks} clicks
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {url.longUrl}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button variant="outline" size="icon-sm" asChild>
            <Link to={`/analytics/${url.short}`} aria-label="Analytics">
              <LuBarChart size={15} />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setQrActive(true)}
            aria-label="QR code"
          >
            <LuQrCode size={15} />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More options">
                <LuMoreVertical size={16} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="end"
              className="w-40 border border-border bg-popover p-1 shadow-md"
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                onClick={() => setEditActive(true)}
              >
                <LuFileEdit size={14} />
                Edit
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                onClick={() => deleteUrl(url.short)}
              >
                <LuTrash2 size={14} />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <EditLinkModal
        url={url}
        editActive={editActive}
        setEditActive={setEditActive}
        plan={plan}
      />

      <EditQrModal
        url={url}
        setQrActive={setQrActive}
        editQrActive={qrActive}
      />

      <ShareLinkModal
        shareActive={shareActive}
        setShareActive={setShareActive}
        url={url}
      />
    </>
  );
};

export default LinkCard;
