import classNames from "classnames";
import { BsTrash2 } from "react-icons/bs";
import EditorPage from "../../../editor-element";
import { useState } from "react";
import { useEditor } from "../../../../../../hooks/use-editor";
import { defaultStyles } from "../../../../../../Utils/common";

type ContainerProps = { element: any };

const Container = ({ element }: ContainerProps) => {
  const { id, content, name, styles, type } = element;
  const { state, dispatch } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const isSelected = state.editor.selectedElement.id === id;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const componentType = e.dataTransfer.getData("componentType");
    if (!componentType) return;

    const newId = crypto.randomUUID();

    const base = {
      id: newId,
      styles: { ...defaultStyles },
    };

    let elementDetails: any = null;

    switch (componentType) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        elementDetails = {
          ...base,
          name: `Heading ${componentType.charAt(1)}`,
          type: componentType,
          category: "Text",
          content: { innerText: `Heading ${componentType.charAt(1)}` },
          styles: {
            color: "black",
            ...defaultStyles,
            fontSize:
              componentType === "h1"
                ? "2.5rem"
                : componentType === "h2"
                  ? "2rem"
                  : componentType === "h3"
                    ? "1.75rem"
                    : componentType === "h4"
                      ? "1.5rem"
                      : componentType === "h5"
                        ? "1.25rem"
                        : "1rem",
            fontWeight: componentType === "h1" || componentType === "h2" ? "700" : "600",
            lineHeight: "1.2",
            marginBottom: "0.5rem",
          },
        };
        break;
      case "p":
        elementDetails = {
          ...base,
          name: "Paragraph",
          type: componentType,
          category: "Text",
          content: { innerText: "Paragraph" },
          styles: {
            color: "black",
            ...defaultStyles,
            fontSize: "1rem",
            lineHeight: "1.5",
            marginBottom: "1rem",
          },
        };
        break;
      case "image":
        elementDetails = {
          ...base,
          name: "Image",
          type: componentType,
          category: "Basic",
          content: { imageUrl: undefined, altText: undefined },
          styles: {},
        };
        break;
      case "calendar":
        elementDetails = {
          ...base,
          name: "Calendar",
          type: componentType,
          category: "Basic",
          content: { date: undefined },
          styles: { color: "#000000", ...defaultStyles, fontSize: "1rem", display: "flex" },
        };
        break;
      case "websiteList":
        elementDetails = {
          ...base,
          name: "Website List",
          type: componentType,
          category: "Basic",
          content: { links: [] },
          styles: { color: "inherit", ...defaultStyles },
        };
        break;
      case "link":
        elementDetails = {
          ...base,
          name: "Link",
          type: componentType,
          category: "Basic",
          content: {
            innerText: "Visit my website",
            targetUrl: undefined,
            href: undefined,
          },
          styles: { ...defaultStyles, color: "#ffffff" },
        };
        break;
      case "map":
        elementDetails = {
          ...base,
          name: "Map",
          type: componentType,
          category: "Basic",
          content: { latitude: undefined, longitude: undefined },
          styles: { ...defaultStyles },
        };
        break;
      case "container":
        elementDetails = {
          ...base,
          name: "Container",
          type: "container",
          category: "layout",
          content: [],
          styles: { ...defaultStyles },
        };
        break;
      case "2Col":
        elementDetails = {
          ...base,
          name: "Two Column",
          type: "2Col",
          category: "Container",
          content: [
            {
              content: [],
              id: crypto.randomUUID(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
              category: "Container",
            },
            {
              content: [],
              id: crypto.randomUUID(),
              name: "Container",
              styles: { ...defaultStyles, width: "100%" },
              type: "container",
              category: "Container",
            },
          ],
          styles: { ...defaultStyles, display: "flex" },
        };
        break;
      default:
        return;
    }

    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        containerId: id,
        elementDetails,
      },
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleOnClickBody = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleDeleteElement = () => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={classNames("relative group my-1", {
        "max-w-full w-full no-scrollbar":
          (type === "container" || type === "2Col") && !styles?.width,
        "h-fit": type === "container" && !styles?.height,
        "min-h-[120px] w-full": type === "__body",
        "!h-screen !m-0 !rounded-none":
          type === "__body" && state.editor.liveMode,
        "flex flex-col md:!flex-row": type === "2Col",
        "!w-full": type === "__body",

        "outline outline-2 outline-primary":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body" &&
          !isDraggingOver,
        "outline outline-2 outline-primary/60":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "outline outline-2 outline-dashed outline-primary": isDraggingOver,
        "outline outline-1 outline-dashed outline-border":
          !state.editor.liveMode && !isSelected && !isDraggingOver,
      })}
      style={{ width: styles?.width, height: styles?.height }}
      onClick={handleOnClickBody}
    >
      <div
        className={classNames(
          "absolute -left-px -top-6 hidden cursor-default rounded-t-md bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground",
          {
            block: isSelected && !state.editor.liveMode,
          }
        )}
      >
        {name}
      </div>

      <div
        style={{ ...styles, width: undefined, height: undefined }}
        className="h-full w-full"
      >
        {Array.isArray(content) &&
          content.map((childElement: any) => (
            <EditorPage key={childElement.id} element={childElement} />
          ))}
      </div>

      {isSelected &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteElement();
            }}
            className="absolute -right-px -top-6 rounded-t-md bg-destructive px-2 py-0.5 text-destructive-foreground"
            aria-label="Delete element"
          >
            <BsTrash2 size={12} />
          </button>
        )}
    </div>
  );
};

export default Container;
