import { EditorElement, useEditor } from "../../../../../../hooks/use-editor";
import ElementWrapper from "../layouts/element-wrapper";

type TextProps = {
  element: EditorElement;
};

function TextComponent({ element }: TextProps) {
  const { state, dispatch } = useEditor();

  const handleBlur = (e: React.FocusEvent<Element>) => {
    const textElement = e.target as HTMLElement;
    const newText = textElement.innerText.trim();
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          content: { innerText: newText },
        },
      },
    });
  };

  const TextTag = (element.type as keyof JSX.IntrinsicElements) || "p";

  return (
    <ElementWrapper element={element}>
      <div
        style={element.styles}
        className="w-full px-1 py-0.5 transition-all"
      >
        <TextTag
          contentEditable={!state.editor.liveMode}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="m-0 border-none p-0 outline-none focus:outline-none"
        >
          {!Array.isArray(element.content) && element.content.innerText}
        </TextTag>
      </div>
    </ElementWrapper>
  );
}

export default TextComponent;
