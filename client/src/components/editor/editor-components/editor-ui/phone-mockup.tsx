import { BaseBoxShapeUtil, HTMLContainer, RecordProps, T, TLShape } from 'tldraw'
import EditorPage from "../editor-element";
import PageEditor from "../../index";

const MY_EDITABLE_SHAPE_TYPE = 'my-editable-shape'

declare module 'tldraw' {
    export interface TLGlobalShapePropsMap {
        [MY_EDITABLE_SHAPE_TYPE]: {
            w: number
            h: number
            animal: number
        }
    }
}

const ANIMAL_EMOJIS = ['🐶', '🐱', '🐨', '🐮', '🐴']

export type IMyEditableShape = TLShape<typeof MY_EDITABLE_SHAPE_TYPE>

export class EditableShapeUtil extends BaseBoxShapeUtil<IMyEditableShape> {
    static override type = MY_EDITABLE_SHAPE_TYPE
    static override props: RecordProps<IMyEditableShape> = {
        w: T.number,
        h: T.number,
        animal: T.number,
    }

    // [1]
    override canEdit() {
        return true
    }

    // [1b]
    override canEditWhileLocked() {
        return true
    }

    getDefaultProps(): IMyEditableShape['props'] {
        return {
            w: 450,
            h: 800,
            animal: 0,
        }
    }

    // [2]
    component(shape: IMyEditableShape) {
        // [a]
        const isEditing = this.editor.getEditingShapeId() === shape.id
        console.log(shape.id)

        return (
            <HTMLContainer
                id={shape.id}
                // [b]
                // onPointerDown={isEditing ? this.editor.markEventAsHandled : undefined}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#f8fafc',
                    border: '3px dashed #94a3b8',
                    borderRadius: '12px',
                    backgroundColor: 'red',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'auto',
                    // padding: 16,
                }}
            >
               <PageEditor pageId="gaming" liveMode={false} />
            </HTMLContainer>
        )
    }

    indicator(shape: IMyEditableShape) {
        return <rect width={shape.props.w} height={shape.props.h} />
    }

    // [3]
    override onEditEnd(shape: IMyEditableShape) {
        this.editor.animateShape(
            { ...shape, rotation: shape.rotation + Math.PI * 2 },
            { animation: { duration: 250 } }
        )
    }
}