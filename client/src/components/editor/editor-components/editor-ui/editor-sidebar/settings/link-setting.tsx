import React from "react";
import {LuChevronDown, LuLink} from "react-icons/lu";
import Input from "../../../../../ui/Input";
import {useGetUrlsQuery} from "../../../../../../app/services/urlapi";
import {getWebsiteName} from "../../../../../../Utils/getSiteUrl";
import {useEditor} from "../../../../../../hooks/use-editor";

interface Props {
    state: any;
    handleCustomValuesChange: (e: any) => void;
}

const LinkSetting = ({state, handleCustomValuesChange }: Props) => {
    const {dispatch} = useEditor();
    const {data, isLoading} = useGetUrlsQuery({});

    const handleSelectChange = (item: any) => {
        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        href: item.short,
                        targetUrl: item.longUrl,
                    },
                },
            },
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <div>
                <div
                    className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                    <LuLink className="w-3 h-3"/>
                    Link Name
                </div>
                <Input
                    id="innerText"
                    placeholder="https:www.framely.site/editor"
                    onChange={handleCustomValuesChange}
                    value={state.editor.selectedElement.content.innerText}
                />
            </div>

            <div>
                <div
                    className="flex items-center gap-2 text-foreground/40 uppercase text-[10px] font-bold tracking-widest">
                    <LuLink className="w-3 h-3"/>
                    Link Path
                </div>
                <div className="relative w-full">
                    <div className="w-full h-full max-h-[200px] px-1 overflow-y-scroll bg-base-200 no-scrollbar">
                        {!isLoading && data &&
                            data.urls?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex cursor-pointer items-center rounded-md border border-base-300 px-4 text-sm py-1 hover: hover:ring-2 hover:ring-primary mt-1"
                                    onClick={() => handleSelectChange(item)}
                                >
                                    {getWebsiteName(item.longUrl)}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LinkSetting;