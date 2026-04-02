import {EditorElement} from "../../../hooks/use-editor";
import Container from "./editor-ui/layouts/container";
import TextComponent from "./editor-ui/blocks/text";
import CalendarBlock from "./editor-ui/blocks/calendar";
import WebsiteList from "./editor-ui/blocks/website-list";

type EditorProps = { element: EditorElement }

function EditorPage({element}: EditorProps) {
    switch (element.type) {
        case '__body':
            return <Container element={element}/>;
        case 'container':
            return <Container element={element}/>;
        case "calendar":
            return <CalendarBlock element={element}/>;
        case "websiteList":
            return <WebsiteList element={element}/>;
        case "Map":
            return <Container element={element}/>;
        case "link":
            return <Container element={element}/>;
        case "image":
            return <Container element={element}/>;
        case "2Col":
            return <Container element={element}/>;
        case "button":
            return <Container element={element}/>;
    }

    switch (element.category) {
        case 'Text':
            return <TextComponent element={element}/>;
        default:
            return null;
    }
}

export default EditorPage;