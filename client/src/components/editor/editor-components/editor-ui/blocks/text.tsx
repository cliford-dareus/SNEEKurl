import {EditorElement, useEditor} from "../../../../../hooks/use-editor";
import ElementWrapper from "../layouts/element-wrapper";

type TextProps = {
    element: EditorElement;
};

function TextComponent({element}: TextProps) {
    const {state, dispatch} = useEditor();

    const handleBlur = (e: React.FocusEvent<Element>) => {
        const textElement = e.target as HTMLElement;
        const newText = textElement.innerText.trim();
        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...element,
                    content: {innerText: newText},
                },
            },
        });
    };

    const TextTag = element.type as keyof JSX.IntrinsicElements;

    return (
        <ElementWrapper element={element}>
            <div
                // style={element.styles}
                className="p-[2px] w-full relative transition-all overflow-auto"
            >
                <TextTag
                    contentEditable={!state.editor.liveMode}
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    className="border-none outline-none"
                    style={{
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {!Array.isArray(element.content) && element.content.innerText}
                </TextTag>
            </div>
        </ElementWrapper>
    );
}

export default TextComponent;