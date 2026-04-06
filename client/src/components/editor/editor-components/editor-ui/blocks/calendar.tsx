import {BsCalendar} from "react-icons/bs";
import ElementWrapper from "../layouts/element-wrapper";
import {EditorElement, useEditor} from "../../../../../hooks/use-editor";

type TextProps = {
    element: EditorElement;
};

function CalendarBlock({element}: TextProps) {
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

    return (
        <ElementWrapper element={element}>
            <div
                style={element.styles}
                className="p-[4px] w-full relative transition-all overflow-auto"
            >
                <BsCalendar className="text-5xl text-background"/>
            </div>
        </ElementWrapper>
    );
}

export default CalendarBlock;