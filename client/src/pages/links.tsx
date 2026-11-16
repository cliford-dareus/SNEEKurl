import React, { useState } from "react";
import { useGetUrlsQuery } from "../app/services/urlapi";
import { LuArrowDown, LuArrowUp, LuFilter } from "react-icons/lu";
import LinkItems from "../components/link-items";
import FilterLinkModal from "../components/modals/filter-link-modal";
import { useUserPlan } from "../components/layout/admin-layout";
import { Button } from "../components/ui/button";

const Links = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState<any[]>([]);
  const plan = useUserPlan();
  const { data, isLoading } = useGetUrlsQuery({});

  return (
    <section className="relative">
      <div className="sticky top-0 z-20 mb-4 flex items-center gap-3 rounded-lg border border-border bg-card/80 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              My Links
            </h1>
            <p className="text-xs text-muted-foreground">
              {data?.urls?.length ?? 0} total links
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

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => setOpenFilter(true)}
        >
          <LuFilter size={14} />
          Filter
        </Button>
      </div>

      <LinkItems />

      <FilterLinkModal
        open={openFilter}
        setOpen={setOpenFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </section>
  );
};

export default Links;
