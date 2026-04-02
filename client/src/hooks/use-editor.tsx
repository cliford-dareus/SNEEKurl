import React, {createContext, useReducer} from "react";

type DeviceType = 'desktop' | 'mobile' | 'tablet'

export type EditorElement = {
    id: string;
    name: string;
    styles: React.CSSProperties;
    type: any;
    category: any;
    content:
        | {
        href?: string;
        innerText?: string;
        imageUrl?: string
        altText?: string;
        targetUrl?: string;
    } | EditorElement[];
}

type Editor = {
    pageId: string;
    pageLinks: any;
    liveMode: boolean;
    previewMode: boolean;
    visible: boolean;
    elements: EditorElement[];
    selectedElement: EditorElement;
    device: DeviceType;
}

type EditorState = {
    editor: Editor
}

type EditorAction =
    | {
    type: "LOAD_DATA",
    payload: {
        elements: EditorElement[],
        withLive: boolean
        pageLinks?: any
    }
}
    | {
    type: "ADD_ELEMENT",
    payload: {
        containerId: string,
        elementDetails: EditorElement,
    }
}
    | {
    type: "UPDATE_ELEMENT",
    payload: {
        elementDetails: EditorElement,
    }
} | {
    type: "DELETE_ELEMENT",
    payload: {
        elementDetails: EditorElement,
    }
}
    | { type: "TOGGLE_LIVE_MODE" }
    | { type: "TOGGLE_PREVIEW_MODE" }
    | { type: "TOGGLE_VISIBLE" }
    | {
    type: "CHANGE_SELECTED_ELEMENT",
    payload: {
        elementDetails: EditorElement | {
            content: [],
            id: "",
            name: "",
            styles: {},
            type: null,
            category: null
        }
    }
}

const initialEditorState: EditorState['editor'] = {
    elements: [
        {
            content: [],
            id: "__body",
            name: "Body",
            styles: {
                pointerEvents: "all"
            },
            type: "__body",
            category: "Container"
        }
    ],
    selectedElement: {
        content: [],
        id: "__body",
        name: "Body",
        styles: {},
        type: "__body",
        category: "Container"
    },
    pageLinks: [],
    device: "mobile",
    liveMode: false,
    previewMode: false,
    visible: false,
    pageId: ""
}

const initialState: EditorState = {
    editor: initialEditorState
}

const addElement = (elements: EditorElement[], action: EditorAction): EditorElement[] => {
    if (action.type !== "ADD_ELEMENT") {
        throw new Error("Invalid action type");
    }

    return elements.map(element => {
        if (element.id === action.payload.containerId && Array.isArray(element.content)) {
            return {
                ...element,
                content: [...element.content, action.payload.elementDetails]
            }
        }else if (element.content && Array.isArray(element.content)) {
            return {
                ...element,
                content: addElement(element.content, action)
            }
        }
        return element
    })
}

const updateElement = (elements: EditorElement[], action: EditorAction): EditorElement[] => {
    if (action.type !== "UPDATE_ELEMENT") {
        throw new Error("Invalid action type");
    }

    return elements.map(element => {
        if (element.id === action.payload.elementDetails.id) {
            return {
                ...element,
                ...action.payload.elementDetails
            }
        } else if (element.content && Array.isArray(element.content)) {
            return {
                ...element,
                content: updateElement(element.content, action)
            }
        }
        return element
    })
}

const deleteElement = (elements: EditorElement[], action: EditorAction): EditorElement[] => {
    if (action.type !== "DELETE_ELEMENT") {
        throw new Error("Invalid action type");
    }
    return elements.filter(element => {
        if (element.id === action.payload.elementDetails.id) {
            return false
        } else if (element.content && Array.isArray(element.content)) {
            element.content = deleteElement(element.content, action)
        }
        return true
    })
};

const editorReducer = (state: EditorState, action: EditorAction) => {
    switch (action.type) {
        case "ADD_ELEMENT":
            const updateEditorState = {
                ...state.editor,
                elements: addElement(state.editor.elements, action)
            }

            return {
                ...state,
                editor: updateEditorState
            }
        case "UPDATE_ELEMENT":
            const updatedElements = updateElement(state.editor.elements, action)
            const updatedElementIsSelected = state.editor.selectedElement.id === action.payload.elementDetails.id
            const updatedEditorState = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: updatedElementIsSelected ? action.payload.elementDetails : {
                    id: "",
                    name: "",
                    styles: {},
                    type: null,
                    category: null,
                    content: []
                }
            }
            return {
                ...state,
                editor: updatedEditorState
            }
        case "DELETE_ELEMENT":
            const updatedElementsAfterDelete = deleteElement(state.editor.elements, action)
            const updatedEditorStateAfterDelete = {
                ...state.editor,
                elements: updatedElementsAfterDelete,
                selectedElement: {
                    id: "",
                    name: "",
                    styles: {},
                    type: null,
                    category: null,
                    content: []
                }
            }
            return {
                ...state,
                editor: updatedEditorStateAfterDelete
            }
        case "TOGGLE_LIVE_MODE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    liveMode: !state.editor.liveMode
                }
            }
        case "TOGGLE_PREVIEW_MODE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    previewMode: !state.editor.previewMode
                }
            }
        case "TOGGLE_VISIBLE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    visible: !state.editor.visible
                }
            }
        case "LOAD_DATA":
            return {
                ...initialState,
                editor: {
                    ...initialState.editor,
                    elements: action.payload.elements || initialEditorState.elements,
                    pageLinks: action.payload.pageLinks,
                    liveMode: action.payload.withLive
                }
            }
        case "CHANGE_SELECTED_ELEMENT":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    selectedElement: action.payload.elementDetails || {
                        content: [],
                        id: "",
                        name: "",
                        styles: {},
                        type: null,
                        category: null
                    }
                }
            }
        default:
            return state
    }
}

export type EditorContextData = {
    device: DeviceType
    previewMode: boolean
    setPreviewMode: (value: boolean) => void
    setDevice: (value: DeviceType) => void
}

export const EditorContext = createContext<{
    state: EditorState;
    dispatch: React.Dispatch<any>;
    pageId: string;
    pageDetails: any | null;
}>({
    state: initialState,
    dispatch: () => undefined,
    pageId: "",
    pageDetails: null,
})

type Props = {
    children: React.ReactNode;
    pageId: string;
    pageDetails: any | null;
}

const EditorProvider = (props: Props) => {
    const [state, dispatch] = useReducer(editorReducer, initialState)
    return (
        <EditorContext.Provider value={{
            state,
            dispatch,
            pageId: props.pageId,
            pageDetails: props.pageDetails
        }}>
            {props.children}
        </EditorContext.Provider>
    )
}

export const useEditor = () => {
    const context = React.useContext(EditorContext)
    if (context === undefined) {
        throw new Error("useEditor must be used within a EditorProvider")
    }
    return context
}

export default EditorProvider