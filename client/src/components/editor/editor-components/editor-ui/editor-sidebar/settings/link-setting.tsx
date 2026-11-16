import React from "react";
import { LuLink } from "react-icons/lu";
import Input from "../../../../../ui/Input";
import { useGetUrlsQuery } from "../../../../../../app/services/urlapi";
import { getWebsiteName } from "../../../../../../Utils/getSiteUrl";
import { useEditor } from "../../../../../../hooks/use-editor";

interface Props {
  handleCustomValuesChange: (e: any) => void;
}

const LinkSetting = ({ handleCustomValuesChange }: Props) => {
  const { state, dispatch } = useEditor();
  const { data, isLoading } = useGetUrlsQuery({});

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

  const currentHref = !Array.isArray(state.editor.selectedElement.content)
    ? state.editor.selectedElement.content.href
    : "";

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <LuLink size={12} />
          Label
        </label>
        <Input
          id="innerText"
          placeholder="Visit my website"
          onChange={handleCustomValuesChange}
          value={
            !Array.isArray(state.editor.selectedElement.content)
              ? state.editor.selectedElement.content.innerText || ""
              : ""
          }
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <LuLink size={12} />
          Destination
        </label>
        <div className="max-h-[180px] space-y-1 overflow-y-auto rounded-lg border border-border bg-muted/20 p-1.5">
          {isLoading ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              Loading links...
            </p>
          ) : !data?.urls?.length ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              No short links yet
            </p>
          ) : (
            data.urls.map((item: any, index: number) => (
              <button
                key={item._id || index}
                type="button"
                onClick={() => handleSelectChange(item)}
                className={`flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                  currentHref === item.short
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="truncate">
                  {getWebsiteName(item.longUrl) || item.short}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkSetting;
