import ElementWrapper from "../layouts/element-wrapper";
import {EditorElement} from "../../../../../hooks/use-editor";
import {LuArrowUpRight} from "react-icons/lu";
import VisitLinkButton from "../../../../visit-link-button";

type LinkProps = {
    element: EditorElement;
}

const Link = ({element}: LinkProps) => {
    const href = !Array.isArray(element.content) ? element.content.href : "";
    return (
        <ElementWrapper element={element}>
            <VisitLinkButton url={href!}>
                <div
                    className="w-full h-[50px] flex items-center justify-between px-4 rounded-md border border-background/20"
                    style={element.styles}
                >
                    {!Array.isArray(element.content) && element.content.innerText}
                    <LuArrowUpRight className="text-2xl"/>
                </div>
            </VisitLinkButton>
        </ElementWrapper>
    )
};

export default Link;