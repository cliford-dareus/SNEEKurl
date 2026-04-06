import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import MultiSelect from "../ui/multi-select";
import {CreateLinkInBioProp} from "./create-link-in-bio-modal";
import {useUpdatePageMutation} from "../../app/services/page";
import Label from "../ui/label";
import {Button} from "../ui/button";
import {toast} from "react-toastify";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "../ui/dialog";
import {BsPalette, BsSave} from "react-icons/bs";
import {BLOCKS} from "../../Utils/common";
import {Tabs, TabsList, TabsTrigger} from "../ui/tabs";
import {useEditor} from "../../hooks/use-editor";

type Props = {
    pageId: string;
    createLinkBlockActive: boolean;
    setCreateLinkBlockActive: React.Dispatch<React.SetStateAction<boolean>>;
};

interface CreateLinkBlockProp extends CreateLinkInBioProp {
    links: { _id: string, url: string, name: string }[];
}

const CreateLinkBlockModal = ({
                                  pageId,
                                  createLinkBlockActive,
                                  setCreateLinkBlockActive,
                              }: Props) => {
    const [categories, setCategories] = React.useState("");
    const [updateLinks] = useUpdatePageMutation();
    const {handleSubmit, setValue, reset} = useForm<CreateLinkBlockProp>();

    const handleCreateLinkBlock: SubmitHandler<CreateLinkBlockProp> = async (
        data
    ) => {
        try {
            const response = await updateLinks({
                id: pageId,
                links: data.links,
                category: "website",
            }).unwrap();
            toast.success("Blocks added successfully");
            setCreateLinkBlockActive(false);
            reset();
        } catch (error) {
            toast.error("Block creation failed");
            console.log(error);
        }
    };

    return (
        <Dialog open={createLinkBlockActive} onOpenChange={setCreateLinkBlockActive}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 200 250"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                                fill="currentColor"
                            />
                        </svg>
                        <div>
                            <DialogTitle>Add Links to Block</DialogTitle>
                            <DialogDescription className="text-zinc-400">Add links to your
                                block</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 py-4">
                    <Tabs>
                        <TabsList className="grid w-full grid-cols-2 gap-2" defaultValue={categories}>
                            {BLOCKS.map((block: any) => (
                                <TabsTrigger
                                    value={categories}
                                    key={block.id}
                                    onClick={() => {
                                        setCategories(block.tag);
                                    }}
                                    className="w-full px-4 py-2 bg-base-100 hover:bg-base-300 rounded-md cursor-pointer transition-colors"
                                >
                                    {block.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <form
                        onSubmit={handleSubmit(handleCreateLinkBlock)}
                    >
                        <div className="flex flex-col gap-2 pt-8">
                            <div
                                className="flex items-center gap-2 mb-4 uppercase text-xs font-bold tracking-widest">
                                <BsPalette className="w-3 h-3"/>
                                Block
                            </div>

                            <label className="block text-xs text-zinc-400 ml-1">Select Urls</label>
                            <MultiSelect setvalues={setValue}/>
                        </div>
                    </form>
                </div>

                <DialogFooter className="px-6 py-4">
                    <Button
                        type="submit"
                        onClick={handleSubmit(handleCreateLinkBlock)}
                        className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Add Block
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
};

export default CreateLinkBlockModal;
