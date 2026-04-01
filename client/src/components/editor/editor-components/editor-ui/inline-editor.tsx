import {Tldraw} from 'tldraw'
import 'tldraw/tldraw.css'
import { EditableShapeUtil} from "./phone-mockup";

function InlineEditor({ width= 402, height = 874, pageId }: { width?: number; height?: number, pageId?: string }) {
    const customShapeUtils = [EditableShapeUtil]

    return (
        <section>
            <div
                style={{
                    height,
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'transparent',
                }}
                className="tldraw__editor"
            >
                <Tldraw
                    hideUi={true}
                    shapeUtils={customShapeUtils}
                    onMount={(editor) => {
                        editor.createShape({type: 'my_phone_mockup_shape', x: 100, y: 100, props: {pageId: pageId}})
                        editor.setCameraOptions({
                            isLocked: false,
                            wheelBehavior: 'none',
                            zoomSpeed: 0,
                        })
                        editor.zoomToBounds({ x: 50, y: 200, w: 550, h: 698 }, { animation: { duration: 0 } });
                    }}
                />
            </div>
        </section>
    )
};

export default InlineEditor;