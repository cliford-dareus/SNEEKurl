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
      <div className="flex items-center gap-3 py-4">
        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() =>
            isPages ? setCreateLinkInBioActive(true) : setAddLinkActive(true)
          }
        >
          <LuPlus size={16} />
          {isPages ? "New page" : "New link"}
        </Button>

        <div
          className="flex h-8 flex-1 cursor-text items-center gap-2 rounded-md border border-input bg-transparent px-3 transition-colors hover:border-ring/50"
          onClick={() => setSearchLinkActive(true)}
        >
          <LuSearch size={15} className="shrink-0 text-muted-foreground" />
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
