import ElementWrapper from "../layouts/element-wrapper";
import {EditorElement} from "../../../../../hooks/use-editor";

type ImageProps = {
    element: EditorElement;
}

const Image = ({element}: ImageProps) => {
    if(Array.isArray(element.content)) {
        return(
            <ElementWrapper element={element}>
                <div className="w-full h-[50px] bg-secondary text-secondary-foreground flex items-center justify-center">
                    <p className="text-sm">No image selected</p>
                </div>
            </ElementWrapper>
        )
    };

    return(
        <ElementWrapper element={element}>
            <div
                style={element.styles}
                className="w-full h-[300px] relative transition-all overflow-clip rounded-md"
            >
                <img
                    src={element.content.imageUrl}
                    alt={element.content.altText}
                    className="w-full h-full object-cover"
                />
            </div>
        </ElementWrapper>
    )
};

export default Image;