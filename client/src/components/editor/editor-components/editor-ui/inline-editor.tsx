import {Tldraw} from 'tldraw'
import 'tldraw/tldraw.css'
import { EditableShapeUtil} from "./phone-mockup";
import IPHONE_MOCKUP from "../../../../assets/apple-iphone-15-black-portrait.png";

{/*
    TODO:  set zoom to 85% on onload
    TODO: disable pinch to zoom if ppossible
*/}

function InlineEditor({ width= 402, height = 874 }: { width?: number; height?: number }) {
    const customShapeUtils = [EditableShapeUtil]

    return (
        <section>
            <div
                style={{
                    height,
                    position: 'relative',
                    overflow: 'hidden',
                    // border: '1px solid #e5e5e5',
                    background: 'transparent',
                }}
                className="tldraw__editor"
            >
                <Tldraw
                    hideUi={true}
                    shapeUtils={customShapeUtils}
                    onMount={(editor) => {
                        editor.createShape({type: 'my_phone_mockup_shape', x: 100, y: 100 })
                        editor.setCameraOptions({
                            isLocked: false,           // keep panning if you want
                            wheelBehavior: 'none',     // disables mouse wheel + trackpad pinch
                            zoomSpeed: 0, // extra safety
                        })
                        editor.zoomToBounds({ x: 50, y: 200, w: 550, h: 698 }, { animation: { duration: 0 } });
                    }}
                />
            </div>
        </section>
    )
};

export default InlineEditor;