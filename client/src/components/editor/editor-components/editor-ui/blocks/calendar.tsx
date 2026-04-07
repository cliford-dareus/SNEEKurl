import {useState} from "react";
import ElementWrapper from "../layouts/element-wrapper";
import {EditorElement, useEditor} from "../../../../../hooks/use-editor";
import {Calendar} from "../../../../ui/calendar";
import {Card, CardContent} from "../../../../ui/card";

type TextProps = {
    element: EditorElement;
};

function CalendarBlock({element}: TextProps) {
    const {state, dispatch} = useEditor();
    const [date, setDate] = useState<Date | undefined>(
        new Date(new Date().getFullYear(), 1, 3)
    )
    const bookedDates = Array.from(
        { length: 15 },
        (_, i) => new Date(new Date().getFullYear(), 1, 12 + i)
    )

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
                <Card className="w-full h-full p-0">
                    <CardContent className="p-0 w-full h-full">
                        <Calendar
                            mode="single"
                            defaultMonth={date}
                            selected={date}
                            onSelect={setDate}
                            disabled={bookedDates}
                            className="w-full"
                            modifiers={{
                                booked: bookedDates,
                            }}
                            modifiersClassNames={{
                                booked: "[&>button]:line-through opacity-100",
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </ElementWrapper>
    );
}

export default CalendarBlock;