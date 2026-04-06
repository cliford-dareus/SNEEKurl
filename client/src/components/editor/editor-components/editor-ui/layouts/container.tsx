import classNames from "classnames";
import {BsTrash2} from "react-icons/bs";
import EditorPage from "../../editor-element";
import {useEffect, useRef, useState} from "react";
import {useEditor} from "../../../../../hooks/use-editor";
import {defaultStyles} from "../../../../../Utils/common";

type ContainerProps = { element: any, editor?: any }

const Container = ({element, editor}: ContainerProps) => {
    const {id, content, name, styles, type} = element;
    const {state, dispatch} = useEditor();
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
                                content: {
                                    innerText: "Paragraph",
                                },
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
                                content: {
                                    innerText: "Text",
                                },
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
                                content: {
                                    imageUrl: undefined,
                                    altText: undefined,
                                },
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
                                content: {
                                    date: undefined,
                                },
                                id: crypto.randomUUID(),
                                name: "Calendar",
                                styles: {
                                    color: "red",
                                    ...defaultStyles,
                                    fontSize: "2rem",
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
                                content: {
                                    links: [],
                                },
                                id: crypto.randomUUID(),
                                name: "Website List",
                                styles: {
                                    color: "red",
                                    ...defaultStyles,
                                },
                                type: componentType,
                                category: "Basic",
                            }
                        }
                    })
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
                                styles: {
                                    ...defaultStyles,
                                },
                                type: "container",
                                category: "layout",
                            }
                        }
                    })
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
                                        styles: {
                                            ...defaultStyles,
                                            width: "100%",
                                        },
                                        type: "container",
                                        category: "Container",
                                    },
                                    {
                                        content: [],
                                        id: crypto.randomUUID(),
                                        name: "Container",
                                        styles: {
                                            ...defaultStyles,
                                            width: "100%",
                                        },
                                        type: "container",
                                        category: "Container",
                                    }
                                ],
                                id: crypto.randomUUID(),
                                name: "Two Column",
                                styles: {
                                    ...defaultStyles,
                                    display: "flex",
                                },
                                type: "2Col",
                                category: "Container",
                            }
                        }
                    })
                    break;
                default:
            }

        }

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

        el.addEventListener('dragstart', (e) => handleDragStart(e, type), false);
        el.addEventListener('dragover', handleDragOver, false);
        el.addEventListener('dragleave', handleDragLeave, false);
        el.addEventListener('drop', handleOnDrop, false);

        return () => {
            el.removeEventListener('dragover', handleDragOver, false);
            el.removeEventListener('dragleave', handleDragLeave, false);
            el.removeEventListener('drop', handleOnDrop, false);
        };
    }, [dispatch, id, type])

    const handleOnClickBody = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_SELECTED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleDeleteElement = () => {
        dispatch({type: "DELETE_ELEMENT", payload: {elementDetails: element}});
    };

    return (
        <div
            ref={containerRef}
            className={classNames("relative group my-1", {
                "max-w-full w-full":
                    (type === "container" || type === "2Col") && !styles?.width,
                "h-fit": type === "container" && !styles?.height,
                "h-full": type === "__body",
                "!h-screen !m-0 !rounded-none":
                    type === "__body" && state.editor.liveMode,
                "flex flex-col md:!flex-row": type === "2Col",
                "!w-[350px]": type === "__body" && state.editor.device === "mobile",
                "!w-[800px]": type === "__body" && state.editor.device === "tablet",
                "!w-full": type === "__body" && state.editor.device === "desktop",
                "transition-[width,height]": type == "__body",
                "!outline-blue-500 !outline-2":
                    isSelected &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type !== "__body" &&
                    !isDraggingOver,
                "!outline-yellow-400 !outline-4":
                    isSelected &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type === "__body",
                "!outline-yellow-400 !outline-solid !outline-2": isDraggingOver,
                "!outline-4": isDraggingOver && type === "__body",
                "!outline-solid": isSelected && !state.editor.liveMode,
                "outline-dashed outline-[1px] outline-slate-300":
                    !state.editor.liveMode,
            })}
            style={{width: styles?.width, height: styles?.height}}
            onClick={(e) => handleOnClickBody(e)}
            // onPointerDown={(e) => e.stopPropagation()}
        >
            <div
                className={classNames(
                    "absolute -top-[24px] -left-[1px] rounded-none rounded-t-lg hidden cursor-default bg-primary text-primary-foreground dark:bg-background dark:text-foreground",
                    {
                        block: isSelected && !state.editor.liveMode,
                    },
                )}
            >
                {name}
            </div>

            <div
                style={{...styles, width: undefined, height: undefined}}
                className="w-full h-full p-4"
            >
                {Array.isArray(content) &&
                    content.map((childElement) => (
                        <EditorPage key={childElement.id} element={childElement}/>
                    ))}
            </div>

            {isSelected &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== "__body" && (
                    <div
                        className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[26px] -right-[1px] rounded-none rounded-t-lg dark:bg-background">
                        <BsTrash2 className="inline-block mr-1" onClick={handleDeleteElement} size={16}/>
                    </div>
                )}
        </div>
    );
};

export default Container;