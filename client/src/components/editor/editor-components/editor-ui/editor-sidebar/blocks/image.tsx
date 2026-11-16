import ElementWrapper from "../layouts/element-wrapper";
import { EditorElement } from "../../../../../../hooks/use-editor";

type ImageProps = {
  element: EditorElement;
};

const Image = ({ element }: ImageProps) => {
  const hasImage =
    !Array.isArray(element.content) && !!element.content.imageUrl;

  if (!hasImage) {
    return (
      <ElementWrapper element={element}>
        <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          No image selected
        </div>
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper element={element}>
      <div
        style={element.styles}
        className="relative w-full overflow-hidden rounded-lg"
      >
        <img
          src={element.content.imageUrl}
          alt={element.content.altText || ""}
          className="h-full w-full object-cover"
          style={{ minHeight: element.styles.height || 160 }}
        />
      </div>
    </ElementWrapper>
  );
};

export default Image;
