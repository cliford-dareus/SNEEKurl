import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../ui/accordion";
import Input from "../../../../../ui/Input";
import { useEditor } from "../../../../../../hooks/use-editor";

type Props = {
  handleOnChange: (e: any) => void;
};

const Transform = ({ handleOnChange }: Props) => {
  const { state } = useEditor();
  const styles = state.editor.selectedElement.styles || {};

  return (
    <AccordionItem value="transform" className="border-border">
      <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
        Layout
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-4 pt-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Width
            </label>
            <Input
              id="width"
              placeholder="100%"
              value={styles.width || ""}
              onChange={handleOnChange}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Height
            </label>
            <Input
              id="height"
              placeholder="auto"
              value={styles.height || ""}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Margin
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="marginTop"
              placeholder="Top"
              value={styles.marginTop || ""}
              onChange={handleOnChange}
            />
            <Input
              id="marginBottom"
              placeholder="Bottom"
              value={styles.marginBottom || ""}
              onChange={handleOnChange}
            />
            <Input
              id="marginLeft"
              placeholder="Left"
              value={styles.marginLeft || ""}
              onChange={handleOnChange}
            />
            <Input
              id="marginRight"
              placeholder="Right"
              value={styles.marginRight || ""}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Padding
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="paddingTop"
              placeholder="Top"
              value={styles.paddingTop || ""}
              onChange={handleOnChange}
            />
            <Input
              id="paddingBottom"
              placeholder="Bottom"
              value={styles.paddingBottom || ""}
              onChange={handleOnChange}
            />
            <Input
              id="paddingLeft"
              placeholder="Left"
              value={styles.paddingLeft || ""}
              onChange={handleOnChange}
            />
            <Input
              id="paddingRight"
              placeholder="Right"
              value={styles.paddingRight || ""}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Transform;
