import {EditorElement} from "../../../hooks/use-editor";
import Container from "./editor-ui/editor-sidebar/layouts/container";
import TextComponent from "./editor-ui/editor-sidebar/blocks/text";
import CalendarBlock from "./editor-ui/editor-sidebar/blocks/calendar";
import WebsiteList from "./editor-ui/editor-sidebar/blocks/website-list";
import Image from "./editor-ui/editor-sidebar/blocks/image";
import Link from "./editor-ui/editor-sidebar/blocks/link";
import Map from "./editor-ui/editor-sidebar/blocks/map";

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
        case "map":
            return <Map element={element}/>;
        case "link":
            return <Link element={element}/>;
        case "image":
            return <Image element={element}/>;
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
};

export default EditorPage;