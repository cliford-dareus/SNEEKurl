import {AccordionContent, AccordionItem, AccordionTrigger} from "../../../../../ui/accordion";
import Input from "../../../../../ui/Input";
import {useEditor} from "../../../../../../hooks/use-editor";

type Props = {
    handleOnChange: (e: any) => void;
}

const Transform = ({handleOnChange}: Props) => {
    const {state, dispatch} = useEditor();

    return (
        <AccordionItem value="transform">
            <AccordionTrigger>Transform</AccordionTrigger>
            <AccordionContent className="flex flex-col px-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2 text-muted-foreground">Width</p>
                        <Input
                            id="width"
                            placeholder="100%"
                            value={state.editor.selectedElement.styles.width || ""}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div>
                        <p className="mb-2 text-muted-foreground">Height</p>
                        <Input
                            id="height"
                            placeholder="auto"
                            value={state.editor.selectedElement.styles.height || ""}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-muted-foreground">Margin</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            id="marginTop"
                            placeholder="Top"
                            value={state.editor.selectedElement.styles.marginTop || ""}
                            onChange={handleOnChange}
                        />
                        <Input
                            id="marginBottom"
                            placeholder="Bottom"
                            value={state.editor.selectedElement.styles.marginBottom || ""}
                            onChange={handleOnChange}
                        />
                        <Input
                            id="marginLeft"
                            placeholder="Left"
                            value={state.editor.selectedElement.styles.marginLeft || ""}
                            onChange={handleOnChange}
                        />
                        <Input
                            id="marginRight"
                            placeholder="Right"
                            value={state.editor.selectedElement.styles.marginRight || ""}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-muted-foreground">Padding</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            id="paddingTop"
                            placeholder="Top"
                            value={state.editor.selectedElement.styles.paddingTop || ""}
                            onChange={handleOnChange}
                        />{" "}
                        <Input
                            id="paddingBottom"
                            placeholder="Bottom"
                            value={state.editor.selectedElement.styles.paddingBottom || ""}
                            onChange={handleOnChange}
                        />
                        <Input
                            id="paddingLeft"
                            placeholder="Left"
                            value={state.editor.selectedElement.styles.paddingLeft || ""}
                            onChange={handleOnChange}
                        />
                        <Input
                            id="paddingRight"
                            placeholder="Right"
                            value={state.editor.selectedElement.styles.paddingRight || ""}
                            onChange={handleOnChange}
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
};

export default Transform;

