import {EditorElement} from "../../../hooks/use-editor";
import Container from "./editor-ui/container";
import TextComponent from "./editor-ui/text";
import CalendarBlock from "./editor-ui/blocks/calendar";

type EditorProps = { element: EditorElement }

function EditorPage({element}: EditorProps) {
    switch (element.type) {
        case '__body':
            return <Container element={element}/>;
        case 'container':
            return <Container element={element}/>;
        case "calendar":
            return <CalendarBlock element={element}/>;
        case "link":
        case "image":
        case "2col":


    }

    switch (element.category) {
        case 'Text':
            return <TextComponent element={element}/>;
        default:
            return null;
    }
}

export default EditorPage;