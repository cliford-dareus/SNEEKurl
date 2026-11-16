import ElementWrapper from "../layouts/element-wrapper";
import { EditorElement } from "../../../../../../hooks/use-editor";
import { LuArrowUpRight } from "react-icons/lu";
import VisitLinkButton from "../../../../../visit-link-button";

type LinkProps = {
  element: EditorElement;
};

const Link = ({ element }: LinkProps) => {
  const href = !Array.isArray(element.content) ? element.content.href : "";
  const label =
    !Array.isArray(element.content) && element.content.innerText
      ? element.content.innerText
      : "Visit link";

  return (
    <ElementWrapper element={element}>
      <VisitLinkButton url={href || "#"}>
        <div
          className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
          style={element.styles}
        >
          <span className="truncate">{label}</span>
          <LuArrowUpRight size={16} className="shrink-0 text-muted-foreground" />
        </div>
      </VisitLinkButton>
    </ElementWrapper>
  );
};

export default Link;
