import { Button } from "./ui/button";
import CreateLinkModal from "./modals/create-link-modal";
import { useState } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";
import SearchLinkModal from "./modals/search-link-modal";
import CreateLinkInBioModal from "./modals/create-link-in-bio-modal";

type Props = {
  pathname: string;
};

const DashboardTopInterface = ({ pathname }: Props) => {
  const [searchLinkActive, setSearchLinkActive] = useState(false);
  const [addLinkActive, setAddLinkActive] = useState(false);
  const [createLinkInBioActive, setCreateLinkInBioActive] = useState(false);

  const isPages = pathname === "/pages";

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Button
          size="default"
          className="h-10 shrink-0 gap-1.5 px-4 shadow-sm"
          onClick={() =>
            isPages ? setCreateLinkInBioActive(true) : setAddLinkActive(true)
          }
        >
          <LuPlus size={16} />
          {isPages ? "New page" : "New link"}
        </Button>

        <div
          className="flex h-10 flex-1 cursor-text items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 shadow-sm transition-colors hover:border-ring/60 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40"
          onClick={() => setSearchLinkActive(true)}
        >
          <LuSearch size={16} className="shrink-0 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Search links...
          </span>
        </div>
      </div>

      <CreateLinkModal
        setAddLinkActive={setAddLinkActive}
        addLinkActive={addLinkActive}
      />

      <SearchLinkModal
        searchLinkActive={searchLinkActive}
        setSearchLinkActive={setSearchLinkActive}
      />

      <CreateLinkInBioModal
        createLinkInBioActive={createLinkInBioActive}
        setCreateLinkInBioActive={setCreateLinkInBioActive}
      />
    </>
  );
};

export default DashboardTopInterface;
