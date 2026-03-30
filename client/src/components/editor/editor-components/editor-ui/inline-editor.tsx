import {
    TldrawEditor,
    TldrawUi,
    TldrawHandles,
    TldrawScribble,
    TldrawSelectionForeground,
    TldrawShapeIndicators,
    TldrawOverlays,
    defaultShapeUtils,
    defaultBindingUtils,
    defaultShapeTools,
    defaultTools,
    useEditor, Tldraw,
} from 'tldraw'
import 'tldraw/tldraw.css'
import { EditableShapeUtil} from "./phone-mockup";

const defaultComponents = {
    Scribble: TldrawScribble,
    ShapeIndicators: TldrawShapeIndicators,
    SelectionForeground: TldrawSelectionForeground,
    Handles: TldrawHandles,
    Overlays: TldrawOverlays,
}

function InlineEditor({ height = 600 }: { width?: number; height?: number }) {
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
                    // Pass in the array of custom shape classes
                    shapeUtils={customShapeUtils}
                    // Create a shape when the editor mounts
                    onMount={(editor) => {
                        editor.createShape({id: "shape:mobile-editor", type: 'my-editable-shape', x: 100, y: 100 })
                    }}
                />
            </div>
        </section>
    )
};

export default InlineEditor;