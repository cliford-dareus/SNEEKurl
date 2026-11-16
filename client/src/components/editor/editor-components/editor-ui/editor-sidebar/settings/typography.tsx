import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../ui/accordion";
import Input from "../../../../../ui/Input";
import { useState } from "react";
import { useEditor } from "../../../../../../hooks/use-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../../../../ui/tabs";
import { ColorPicker } from "../../../../../ui/color-picker";
import { BsType } from "react-icons/bs";
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuCaseLower,
  LuCaseSensitive,
  LuCaseUpper,
} from "react-icons/lu";

type Props = {
  handleOnChange: (e: any) => void;
  handleSelectChange: (value: string, property: string) => void;
};

const Typography = ({ handleOnChange, handleSelectChange }: Props) => {
  const { state } = useEditor();
  const styles = state.editor.selectedElement.styles || {};
  const [inputColor, setInputColor] = useState(styles.color || "#ffffff");

  return (
    <AccordionItem value="typography" className="border-border">
      <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
        Typography
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Color
          </label>
          <div className="flex gap-2">
            <ColorPicker
              onChange={(color: string) => {
                const e = { target: { id: "color", value: color } };
                handleOnChange(e);
                setInputColor(color);
              }}
              id="Color"
              value={styles.color || "#ffffff"}
            />
            <Input
              id="color"
              type="text"
              maxLength={7}
              value={inputColor}
              onChange={(e) => {
                const color = e.target.value;
                setInputColor(color);
                if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
                  const event = { target: { id: "color", value: color } };
                  handleOnChange(event);
                }
              }}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Font
            </label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "fontFamily")
              }
              value={styles.fontFamily || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Weight
            </label>
            <Select
              onValueChange={(value: string) =>
                handleSelectChange(value, "fontWeight")
              }
              value={(styles.fontWeight as string) || "400"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="400">Regular</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semi Bold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Size
            </label>
            <Input
              id="fontSize"
              type="text"
              placeholder="16px"
              value={styles.fontSize || ""}
              onChange={handleOnChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Line height
            </label>
            <Input
              id="lineHeight"
              type="text"
              placeholder="1.5"
              value={styles.lineHeight || ""}
              onChange={handleOnChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Letter spacing
            </label>
            <Input
              id="letterSpacing"
              type="text"
              placeholder="0px"
              value={styles.letterSpacing || ""}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Alignment
          </label>
          <Tabs
            value={styles.textAlign || "left"}
            onValueChange={(value: string) =>
              handleSelectChange(value, "textAlign")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="left" aria-label="Align left">
                <LuAlignLeft size={14} />
              </TabsTrigger>
              <TabsTrigger value="center" aria-label="Align center">
                <LuAlignCenter size={14} />
              </TabsTrigger>
              <TabsTrigger value="right" aria-label="Align right">
                <LuAlignRight size={14} />
              </TabsTrigger>
              <TabsTrigger value="justify" aria-label="Justify">
                <LuAlignJustify size={14} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Transform
          </label>
          <Tabs
            value={styles.textTransform || "normal"}
            onValueChange={(value: string) =>
              handleSelectChange(value, "textTransform")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="normal" aria-label="Normal">
                <BsType size={14} />
              </TabsTrigger>
              <TabsTrigger value="capitalize" aria-label="Capitalize">
                <LuCaseSensitive size={14} />
              </TabsTrigger>
              <TabsTrigger value="uppercase" aria-label="Uppercase">
                <LuCaseUpper size={14} />
              </TabsTrigger>
              <TabsTrigger value="lowercase" aria-label="Lowercase">
                <LuCaseLower size={14} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Typography;
