import Button from "./ui/button";
import Portal from "./portal";
import CreateLinkModal from "./ui/modals/create-link-modal";
import {useState} from "react";
import {LuSearch} from "react-icons/lu";
import SearchLinkModal from "./ui/modals/search-link-modal";
import CreateLinkInBioModal from "./ui/modals/create-link-in-bio-modal";

type Props = {
    pathname: string;
};

const DashboardTopInterface = ({pathname}: Props) => {
    const [searchLinkActive, setSearchLinkActive] = useState(false);
    const [addLinkActive, setAddLinkActive] = useState(false);
    const [createLinkInBioActive, setCreateLinkInBioActive] = useState(false);

    return (
        <>
            <div className="flex items-center gap-4 py-4 h-[10vh]">
                {pathname !== "/link-in-bio" ? (
                    <div
                        className="rounded-md border border-slate-200 p-4 min-w-[256px]"
                        onClick={() => setAddLinkActive(true)}
                    >
                        <Button classnames="">Add New Link</Button>
                    </div>
                ) : (
                    <div
                        className="rounded-md border border-slate-200 p-4 min-w-[256px]"
                        onClick={() => setCreateLinkInBioActive(true)}
                    >
                        <Button>Add New Page</Button>
                    </div>
                )}

                <div className="flex-1 rounded-md border border-slate-200 p-3.5">
                    <div
                        className="ml-auto flex w-full justify-between gap-4 rounded-full border border-slate-200 px-4 py-1"
                        onClick={() => setSearchLinkActive(true)}
                    >
                        <input
                            className="w-[80%]"
                            onFocus={() => setSearchLinkActive(true)}
                            placeholder="Search links..."
                        />
                        <Button>
                            <LuSearch/>
                        </Button>
                    </div>
                </div>
            </div>

            <Portal>
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
            </Portal>
        </>
    );
};

export default DashboardTopInterface;
