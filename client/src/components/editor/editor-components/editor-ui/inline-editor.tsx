import {Tldraw} from 'tldraw'
import 'tldraw/tldraw.css'
import { EditableShapeUtil} from "./phone-mockup";

{/*
    TODO:  set zoom to 85% on onload
    TODO: disable pinch to zoom if ppossible
*/}

function InlineEditor({ width= 400, height = 600 }: { width?: number; height?: number }) {
    const customShapeUtils = [EditableShapeUtil]

    return (
        <section>
            <div
                style={{
                    height,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #e5e5e5',
                    background: '#fafafa',
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
                        editor.zoomToBounds({ x: 50, y: 150, w: 500, h: 698 }, { animation: { duration: 0 } });
                    }}
                />
            </div>
        </section>
    )
};

export default InlineEditor;