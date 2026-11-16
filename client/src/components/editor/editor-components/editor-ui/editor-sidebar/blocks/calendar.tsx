import { useState } from "react";
import ElementWrapper from "../layouts/element-wrapper";
import { EditorElement } from "../../../../../../hooks/use-editor";
import { Calendar } from "../../../../../ui/calendar";

type CalendarProps = {
  element: EditorElement;
};

function CalendarBlock({ element }: CalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <ElementWrapper element={element}>
      <div
        style={element.styles}
        className="w-full rounded-lg border border-border bg-card p-2"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="w-full"
        />
      </div>
    </ElementWrapper>
  );
}

export default CalendarBlock;
