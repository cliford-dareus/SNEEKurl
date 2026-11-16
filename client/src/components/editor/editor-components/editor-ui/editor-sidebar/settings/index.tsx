import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../ui/accordion";
import Input from "../../../../../ui/Input";
import { useEditor } from "../../../../../../hooks/use-editor";
import Transform from "./transform";
import Typography from "./typography";
import React, { useState } from "react";
import { LuLink, LuPlus } from "react-icons/lu";
import CreateLinkBlockModal from "../../../../../modals/create-link-block-modal";
import { Textarea } from "../../../../../ui/textarea";
import LinkSetting from "./link-setting";
import { Button } from "../../../../../ui/button";

const Settings = () => {
  const { state, dispatch } = useEditor();
  const [createLinkBlockActive, setCreateLinkBlockActive] = useState(false);

  const handleCustomValuesChange = (e: any) => {
    const settingProperty = e.target.id;
    const value = e.target.value;
    const styleObject = { [settingProperty]: value };

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
    const styleObject = { [styleSettings]: value };

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
    const styleObject = { [property]: value };

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

  const selected = state.editor.selectedElement;
  const label =
    selected.category === "Text"
      ? "Text"
      : selected.type && selected.type !== "__body"
        ? selected.type
        : "Element";

  return (
    <>
      <div className="mb-3 px-1">
        <p className="text-xs font-medium text-muted-foreground">Selected</p>
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
      </div>

      <Accordion type="single" className="w-full" defaultValue="custom">
        <AccordionItem value="custom" className="border-border">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            Content
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-1">
            {(() => {
              if (Array.isArray(selected.content)) return null;

              switch (selected.category) {
                case "Text":
                  return (
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <LuLink size={12} />
                        Text
                      </label>
                      <Textarea
                        id="innerText"
                        placeholder="Enter text..."
                        onChange={handleCustomValuesChange}
                        value={selected.content.innerText || ""}
                        className="min-h-[80px] text-sm"
                      />
                    </div>
                  );
                case "Basic":
                  switch (selected.type) {
                    case "image":
                      return (
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <LuLink size={12} />
                              Image URL
                            </label>
                            <Input
                              id="imageUrl"
                              placeholder="https://..."
                              onChange={handleCustomValuesChange}
                              value={selected.content.imageUrl || ""}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <LuLink size={12} />
                              Alt text
                            </label>
                            <Input
                              id="altText"
                              placeholder="Describe the image"
                              onChange={handleCustomValuesChange}
                              value={selected.content.altText || ""}
                            />
                          </div>
                        </div>
                      );
                    case "websiteList":
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <LuLink size={12} />
                              Links
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 text-xs"
                              onClick={() => setCreateLinkBlockActive(true)}
                            >
                              <LuPlus size={12} />
                              Add
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Reorder links by dragging them in the canvas.
                          </p>
                        </div>
                      );
                    case "link":
                      return (
                        <LinkSetting
                          handleCustomValuesChange={handleCustomValuesChange}
                        />
                      );
                    default:
                      return (
                        <p className="text-xs text-muted-foreground">
                          No content settings for this block.
                        </p>
                      );
                  }
                default:
                  return (
                    <p className="text-xs text-muted-foreground">
                      Select a block to edit its content.
                    </p>
                  );
              }
            })()}
          </AccordionContent>
        </AccordionItem>

        <Typography
          handleOnChange={handleOnChange}
          handleSelectChange={handleSelectChange}
        />
        <Transform handleOnChange={handleOnChange} />
      </Accordion>

      <CreateLinkBlockModal
        createLinkBlockActive={createLinkBlockActive}
        setCreateLinkBlockActive={setCreateLinkBlockActive}
        pageId={state.editor.id}
      />
    </>
  );
};

export default Settings;
