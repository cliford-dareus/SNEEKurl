import {DragEvent, useEffect, useState} from "react";
import {useEditor} from "../../../../../hooks/use-editor";
import {blocks} from "../blocks";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../../../ui/tabs";
import Setting from "./settings";

const EditorSidebar = () => {
    const {state, dispatch} = useEditor();
    const [activeTab, setActiveTab] = useState("block");

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleStartBlockDrag = (e: DragEvent<HTMLDivElement>, type: any) => {
        if (type == null) return;
        e.dataTransfer.setData("componentType", type)
        e.dataTransfer.effectAllowed = "copy"
    }

    useEffect(() => {
        setActiveTab(state.editor.selectedElement.id !== "__body" ? "setting" : "block");
    }, [state.editor.selectedElement.id]);

    return (
        <aside className="w-[250px] h-full">
            <Tabs defaultValue="block" value={activeTab} onValueChange={(e) => handleTabChange(e)}>
                <TabsList variant="default" className="w-full border-b">
                    <TabsTrigger className="" value="block">BLOCKS</TabsTrigger>
                    <TabsTrigger className="" value="layout">LAYOUTS</TabsTrigger>
                    <TabsTrigger className="" value="setting">SETTINGS</TabsTrigger>
                </TabsList>

                <TabsContent value="block">
                    <div className="">
                        <h3 className="font-semibold">Add Blocks</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {blocks.filter((block) => block.group == "block").map((block: any) => (
                                <div
                                    className="flex flex-col gap-2 items-center border justify-center w-full h-20 rounded-md bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors cursor-move"
                                    draggable
                                    key={block.id}
                                    onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                                >
                                    {block?.icon}
                                    {block.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-semibold">Theme Recommendation</h3>
                        <div className=""></div>
                    </div>
                </TabsContent>
                <TabsContent value="layout">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {blocks.filter((block) => block.group == "layout").map((block: any) => (
                            <div
                                className="flex flex-col gap-2 items-center justify-center w-full h-20 rounded-md border bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors cursor-move"
                                draggable
                                key={block.id}
                                onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                            >
                                {block?.icon}
                                {block.label}
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="setting">
                    <Setting/>
                </TabsContent>
            </Tabs>
        </aside>
    )
};

export default EditorSidebar;