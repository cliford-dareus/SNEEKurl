import classNames from "classnames";
import { BsTrash2 } from "react-icons/bs";
import EditorPage from "../../../editor-element";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../../../../../../hooks/use-editor";
import { defaultStyles } from "../../../../../../Utils/common";

type ContainerProps = { element: any; editor?: any };

const Container = ({ element }: ContainerProps) => {
  const { id, content, name, styles, type } = element;
  const { state, dispatch } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const isSelected = state.editor.selectedElement.id === id;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleOnDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      const componentType = e.dataTransfer?.getData("componentType");

      switch (componentType) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: {
                  innerText: `Heading ${componentType.charAt(1)}`,
                },
                id: crypto.randomUUID(),
                name: `Heading ${componentType.charAt(1)}`,
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
                  fontWeight:
                    componentType === "h1" || componentType === "h2"
                      ? "700"
                      : "600",
                  lineHeight: "1.2",
                  marginBottom: "0.5rem",
                },
                type: componentType,
                category: "Text",
              },
            },
          });
          break;
        case "p":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: { innerText: "Paragraph" },
                id: crypto.randomUUID(),
                name: "Paragraph",
                styles: {
                  color: "black",
                  ...defaultStyles,
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  marginBottom: "1rem",
                },
                type: componentType,
                category: "Text",
              },
            },
          });
          break;
        case "span":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: { innerText: "Text" },
                id: crypto.randomUUID(),
                name: "Text",
                styles: {
                  color: "black",
                  ...defaultStyles,
                  fontSize: "1rem",
                  display: "inline",
                },
                type: componentType,
                category: "Text",
              },
            },
          });
          break;
        case "image":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: { imageUrl: undefined, altText: undefined },
                id: crypto.randomUUID(),
                name: "Image",
                styles: {},
                type: componentType,
                category: "Basic",
              },
            },
          });
          break;
        case "calendar":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: { date: undefined },
                id: crypto.randomUUID(),
                name: "Calendar",
                styles: {
                  color: "#000000",
                  ...defaultStyles,
                  fontSize: "1rem",
                  display: "flex",
                },
                type: componentType,
                category: "Basic",
              },
            },
          });
          break;
        case "websiteList":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: { links: [] },
                id: crypto.randomUUID(),
                name: "Website List",
                styles: { color: "inherit", ...defaultStyles },
                type: componentType,
                category: "Basic",
              },
            },
          });
          break;
        case "link":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: {
                  innerText: "Visit my website",
                  targetUrl: undefined,
                  href: undefined,
                },
                id: crypto.randomUUID(),
                name: "Link",
                styles: { ...defaultStyles, color: "#ffffff" },
                type: componentType,
                category: "Basic",
              },
            },
          });
          break;
        case "map":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: { latitude: undefined, longitude: undefined },
                id: crypto.randomUUID(),
                name: "Map",
                styles: { ...defaultStyles },
                type: componentType,
                category: "Basic",
              },
            },
          });
          break;
        case "container":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                content: [],
                id: crypto.randomUUID(),
                name: "Container",
                styles: { ...defaultStyles },
                type: "container",
                category: "layout",
              },
            },
          });
          break;
        case "2Col":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
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
                id: crypto.randomUUID(),
                name: "Two Column",
                styles: { ...defaultStyles, display: "flex" },
                type: "2Col",
                category: "Container",
              },
            },
          });
          break;
        default:
      }
    };

    const handleDragStart = (e: DragEvent, type: string) => {
      if (type !== "__body") {
        e.dataTransfer?.setData("componentType", type);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
    };

    el.addEventListener("dragstart", (e) => handleDragStart(e, type), false);
    el.addEventListener("dragover", handleDragOver, false);
    el.addEventListener("dragleave", handleDragLeave, false);
    el.addEventListener("drop", handleOnDrop, false);

    return () => {
      el.removeEventListener("dragover", handleDragOver, false);
      el.removeEventListener("dragleave", handleDragLeave, false);
      el.removeEventListener("drop", handleOnDrop, false);
    };
  }, [dispatch, id, type]);

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
      ref={containerRef}
      className={classNames("relative group my-1", {
        "max-w-full w-full no-scrollbar":
          (type === "container" || type === "2Col") && !styles?.width,
        "h-fit": type === "container" && !styles?.height,
        "h-full": type === "__body",
        "!h-screen !m-0 !rounded-none":
          type === "__body" && state.editor.liveMode,
        "flex flex-col md:!flex-row": type === "2Col",
        "!w-[350px]": type === "__body" && state.editor.device === "mobile",
        "!w-[800px]": type === "__body" && state.editor.device === "tablet",
        "!w-full": type === "__body" && state.editor.device === "desktop",
        "transition-[width,height]": type === "__body",

        // Soft Indigo selection / drag states
        "outline outline-2 outline-primary":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body" &&
          !isDraggingOver,
        "outline outline-2 outline-primary/60":
          isSelected &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "outline outline-2 outline-dashed outline-primary/70": isDraggingOver,
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
