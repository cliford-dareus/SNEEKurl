import { EditorElement, useEditor } from "../../../../../../hooks/use-editor";
import { BsTrash2 } from "react-icons/bs";
import classNames from "classnames";
import React from "react";

type Props = {
  element: EditorElement;
  children: React.ReactNode;
  className?: string;
};

function ElementWrapper({ element, children, className }: Props) {
  const { state, dispatch } = useEditor();
  const isSelected = state.editor.selectedElement.id === element.id;

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  return (
    <div
      style={{
        width: element.styles.width || "100%",
        height: element.styles.height || "auto",
      }}
      className={classNames(
        "relative my-1",
        className,
        {
          "outline outline-2 outline-primary rounded-md":
            isSelected && !state.editor.liveMode,
          "outline outline-1 outline-dashed outline-border rounded-md":
            !state.editor.liveMode && !isSelected,
        }
      )}
      onClick={handleOnClickBody}
    >
      {isSelected && !state.editor.liveMode && (
        <div className="absolute -left-px -top-5 rounded-t-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          {element.name}
        </div>
      )}

      <div className="overflow-hidden rounded-md">{children}</div>

      {isSelected &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <button
            type="button"
            onClick={handleDeleteElement}
            className="absolute -right-px -top-5 rounded-t-md bg-destructive px-1.5 py-0.5 text-destructive-foreground"
            aria-label="Delete"
          >
            <BsTrash2 size={11} />
          </button>
        )}
    </div>
  );
}

export default ElementWrapper;
