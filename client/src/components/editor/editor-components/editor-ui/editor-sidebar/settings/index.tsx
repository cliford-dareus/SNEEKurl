import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../../../ui/accordion";
import Input from "../../../../../ui/Input";
import {useEditor} from "../../../../../../hooks/use-editor";
import Transform from "./transform";
import Typography from "./typography";
import {BsPalette} from "react-icons/bs";
import MultiSelect from "../../../../../ui/multi-select";
import React, {useState} from "react";
import {Button} from "../../../../../ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "../../../../../ui/popover";
import {BLOCKS} from "../../../../../../Utils/common";
import {LuLink, LuPlus} from "react-icons/lu";
import CreateLinkBlockModal from "../../../../../modals/create-link-block-modal";

const Settings = () => {
    const {state, dispatch} = useEditor();
    const [createLinkBlockActive, setCreateLinkBlockActive] = useState(false);

    const handleCustomValuesChange = (e: any) => {
        const settingProperty = e.target.id;
        const value = e.target.value;
        const styleObject = {[settingProperty]: value};

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        ...styleObject,
                    },
                },
            },
        });
    };

    const handleOnChange = (e: any) => {
        const styleSettings = e.target.id;
        const value = e.target.value;
        const styleObject = {
            [styleSettings]: value,
        };

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                        ...state.editor.selectedElement.styles,
                        ...styleObject,
                    },
                },
            },
        });
    };

    const handleSelectChange = (value: string, property: string) => {
        console.log(value, property);
        const styleObject = {
            [property]: value,
        };

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                        ...state.editor.selectedElement.styles,
                        ...styleObject,
                    },
                },
            },
        });
    };

    return (
        <>
            <Accordion type="single" className="w-full" defaultValue="custom">
                <AccordionItem value="custom">
                    <AccordionTrigger className="!no-underline capitalize">
                        {state.editor.selectedElement.category === "Text"
                            ? "Text"
                            : state.editor.selectedElement.type}
                    </AccordionTrigger>
                    <AccordionContent>
                        {(() => {
                            if (Array.isArray(state.editor.selectedElement.content))
                                return null;

                            switch (state.editor.selectedElement.category) {
                                case "Link":
                                    return (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                                                <LuLink className="w-3 h-3"/>
                                                Link Path
                                            </div>
                                            <Input
                                                id="href"
                                                placeholder="https:www.framely.site/editor"
                                                onChange={handleCustomValuesChange}
                                                value={state.editor.selectedElement.content.href}
                                            />
                                        </div>
                                    );
                                case "Text":
                                    return (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                                                <LuLink className="w-3 h-3"/>
                                                Content
                                            </div>
                                            <textarea
                                                id="innerText"
                                                placeholder="Enter text..."
                                                onChange={handleCustomValuesChange}
                                                value={state.editor.selectedElement.content.innerText}
                                            />
                                        </div>
                                    );
                                case "Basic":
                                    switch (state.editor.selectedElement.type) {
                                        case "image":
                                            return (
                                                <div className="grid grid-rows-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                                                            <LuLink className="w-3 h-3"/>
                                                            Image Url
                                                        </div>
                                                        <Input
                                                            id="imageUrl"
                                                            placeholder="Enter Url..."
                                                            onChange={handleCustomValuesChange}
                                                            value={
                                                                state.editor.selectedElement.content.imageUrl
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                                                            <LuLink className="w-3 h-3"/>
                                                            Alt Text
                                                        </div>
                                                        <Input
                                                            id="altText"
                                                            placeholder="Enter alt text..."
                                                            onChange={handleCustomValuesChange}
                                                            value={state.editor.selectedElement.content.altText}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        case "websiteList":
                                            return (
                                                <div className="grid grid-rows-2 gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                                                            <LuLink className="w-3 h-3"/>
                                                            Links
                                                        </div>
                                                        <button
                                                            onClick={() => setCreateLinkBlockActive(true)}
                                                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-foreground hover:text-foreground/80 transition-colors"
                                                        >
                                                            <LuPlus className="w-3 h-3"/>
                                                            Add Link
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        default:
                                            return null;
                                    }
                                default:
                                    return null;
                            }
                        })()}
                    </AccordionContent>
                </AccordionItem>
                <Typography handleOnChange={handleOnChange} handleSelectChange={handleSelectChange}/>
                <Transform handleOnChange={handleOnChange}/>
            </Accordion>

            <CreateLinkBlockModal
                createLinkBlockActive={createLinkBlockActive}
                setCreateLinkBlockActive={setCreateLinkBlockActive}
                pageId={state.editor.id}
            />
        </>
    )
};

export default Settings;