import {useState} from "react";
import classNames from "classnames";
import {EditorElement, useEditor} from "../../../hooks/use-editor";
import {BsTrash2} from "react-icons/bs";

type ContainerProps = { element: any }

const Container = ({element}: ContainerProps) => {
    const {id, content, name, styles, type} = element;
    const {state, dispatch} = useEditor();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const isSelected = state.editor.selectedElement.id === id;

    const handleOnDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        const componentType = e.dataTransfer.getData("componentType");

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
                                // ...defaultStyles,
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
                                // ...defaultStyles,
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
                                // ...defaultStyles,
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
            case "container":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: crypto.randomUUID(),
                            name: "Container",
                            styles: {},
                            type: "container",
                            category: "layout",
                        }
                    }
                })
            default:
        }

    }

    const handleDragStart = (e: React.DragEvent, type: string) => {
        if (type === "__body") return;
        e.dataTransfer.setData("componentType", type);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleOnClickBody = (e: React.MouseEvent) => {
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
            onDrop={(e) => {
                handleOnDrop(e);
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragStart={(e) => handleDragStart(e, "container")}
            onClick={handleOnClickBody}
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
                        <BsTrash2 className="inline-block mr-1"/>
                    </div>
                )}
        </div>
    );
};

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

type Props = {
    element: EditorElement;
    children: React.ReactNode;
    className?: string;
};

function ElementWrapper({element, children, className}: Props) {
    const {state, dispatch} = useEditor();
    const isSelected = state.editor.selectedElement.id === element.id;

    const handleDeleteElement = () => {
        dispatch({type: "DELETE_ELEMENT", payload: {elementDetails: element}});
    };

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_SELECTED_ELEMENT",
            payload: {elementDetails: element},
        });
    };

    return (
        <div
            style={{
                width: element.styles.width || "auto",
                height: element.styles.height || "auto",
            }}
            className={classNames(className, "relative p-0", {
                "!border-blue-500 !border-2":
                    isSelected &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type !== "__body",
                "!border-yellow-400 !border-4":
                    isSelected &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type === "__body",
                "!border-solid": isSelected && !state.editor.liveMode,
                "border-solid border-[1px] border-slate-300": !state.editor.liveMode,
            })}
            onClick={handleOnClickBody}
        >
            {isSelected && !state.editor.liveMode && (
                <div
                    className={classNames(
                        "absolute -top-[24px] -left-[1px] rounded-none rounded-t-lg bg-primary text-primary-foreground dark:bg-background dark:text-foreground",
                    )}
                    // style={defaultStyles}
                >
                    {element.name}
                </div>
            )}

            <div className="overflow-hidden">{children}</div>

            {isSelected &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== "__body" && (
                    <div
                        className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[26px] -right-[1px] rounded-none rounded-t-lg dark:bg-background">
                        <BsTrash2
                            className="cursor-pointer text-primary-foreground dark:text-foreground"
                            size={16}
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    );
}

type EditorProps = { element: EditorElement }

function EditorPage({element}: EditorProps) {
    switch (element.type) {
        case '__body':
            return <Container element={element}/>;
        case 'image':
            return <img/>;
        case 'container':
            return <Container element={element} />;
    }

    switch (element.category) {
        case 'Text':
            return <TextComponent element={element}/>;
        default:
            return null;
    }
}

export default EditorPage;