import Button from "./ui/button";
import Portal from "./portal";
import CreateLinkModal from "./ui/modals/create-link-modal";
import {useState} from "react";
import {LuSearch} from "react-icons/lu";
import SearchLinkModal from "./ui/modals/search-link-modal";


type Props = {}

const DashboardTopInterface = ({}: Props) => {
    const [searchLinkActive, setSearchLinkActive] = useState(false);
    const [addLinkActive, setAddLinkActive] = useState(false);
    return (
        <>
            <div className="h-[10vh] flex items-center py-4 gap-4">
                <div className='min-w-[256px] p-4 border border-slate-200 rounded-md' onClick={() => setAddLinkActive(true)}>
                    <Button>Add New Link</Button>
                </div>

                <div className="flex-1 p-3.5 border border-slate-200 rounded-md">

                    <div
                        className="w-full py-1 px-4 flex gap-4 justify-between border border-slate-200 rounded-full ml-auto"
                        onClick={() => setSearchLinkActive(true)}
                    >
                        <input className="w-[80%]" onFocus={() => setSearchLinkActive(true)}/>
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
            </Portal>
        </>
    )
};

export default DashboardTopInterface;