import {EditorElement} from "../../../../../hooks/use-editor";
import ElementWrapper from "../layouts/element-wrapper";

type MapProps = {
    element: EditorElement;
}

const Map = ({element}: MapProps) => {
    return(
        <ElementWrapper element={element}>
            <div
                style={element.styles}
                className="w-full min-h-[250px] relative transition-all overflow-clip rounded-md"
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.833420142012!2d72.8232303143852!3d19.070598886898432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9422c349a4f%3A0x40b82c3688c9460!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1687620110222!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                />
            </div>
        </ElementWrapper>
    )
};

export default Map;