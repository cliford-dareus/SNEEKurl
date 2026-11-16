import React, { useState } from "react";
import { LuArrowDown, LuArrowUp, LuFilter, LuSettings, LuExternalLink } from "react-icons/lu";
import { Button } from "../components/ui/button";
import EditPageModal from "../components/modals/edit-page-modal";
import { useGetPagesQuery } from "../app/services/page";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { AiOutlineEdit } from "react-icons/ai";
import { BsClock, BsDot } from "react-icons/bs";
import { TbClick } from "react-icons/tb";

const Pages = () => {
  const { data: pages, isLoading } = useGetPagesQuery();
  const [activeFilter, setActiveFilter] = useState<any[]>([]);
  const [editPageActive, setEditPageActive] = useState({
    state: false,
    id: "",
  });

  const handleOpenLinkInBio = async (slug: string) => {
    window.open(`http://localhost:5173/${slug}`, "_blank");
  };

  return (
    <section>
      <div className="sticky top-0 z-20 mb-4 flex items-center gap-3 rounded-lg border border-border bg-card/80 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              My Pages
            </h1>
            <p className="text-xs text-muted-foreground">
              {pages?.length ?? 0} total pages
            </p>
          </div>

          {activeFilter.length > 0 && (
            <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
              {activeFilter.map((filter, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  <span>{Object.keys(filter)[0]}</span>
                  {Object.values(filter)[0] === "asc" ||
                  Object.values(filter)[0] === "most_click" ? (
                    <LuArrowDown size={12} />
                  ) : (
                    <LuArrowUp size={12} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
          <LuFilter size={14} />
          Filter
        </Button>
      </div>

      {!isLoading && !pages?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            You don't have any link-in-bio pages yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {!isLoading &&
            pages?.map((page: any) => (
              <div key={page._id}>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{page.title}</p>
                      <span
                        className={classNames(
                          "rounded-full px-2 py-0.5 text-[10px] font-medium",
                          page.isPublic
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {page.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="truncate">/{page.slug}</span>
                      <BsDot size={12} />
                      <span className="inline-flex items-center gap-1">
                        <BsClock size={11} />
                        {new Date(page.createdAt as string).toLocaleDateString()}
                      </span>
                      <BsDot size={12} />
                      <span className="inline-flex items-center gap-1">
                        <TbClick size={12} />
                        {page.links.length}{" "}
                        {page.links.length === 1 ? "link" : "links"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button variant="outline" size="icon-sm" asChild>
                      <Link to={`${page.slug}`} aria-label="Edit page">
                        <AiOutlineEdit size={15} />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleOpenLinkInBio(page.slug)}
                      aria-label="Open page"
                    >
                      <LuExternalLink size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setEditPageActive({ state: true, id: page._id })
                      }
                      aria-label="Page settings"
                    >
                      <LuSettings size={15} />
                    </Button>
                  </div>
                </div>

                {page._id === editPageActive.id && (
                  <EditPageModal
                    editPageActive={editPageActive.state}
                    setEditPageActive={setEditPageActive}
                    page={page}
                  />
                )}
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default Pages;
