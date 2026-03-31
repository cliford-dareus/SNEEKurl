import PageEditor from "../../index";
import {BaseBoxShapeUtil, HTMLContainer, RecordProps, T, TLShape} from 'tldraw'
import IPHONE_MOCKUP from "../../../../assets/apple-iphone-15-black-portrait.png"
import React from "react";


const MY_PHONE_MOCKUP_SHAPE_TYPE = 'my_phone_mockup_shape'

declare module 'tldraw' {
    export interface TLGlobalShapePropsMap {
        [MY_PHONE_MOCKUP_SHAPE_TYPE]: {
            w: number
            h: number
            animal: number
        }
    }
}

const ANIMAL_EMOJIS = ['🐶', '🐱', '🐨', '🐮', '🐴']

export type IMyEditableShape = TLShape<typeof MY_PHONE_MOCKUP_SHAPE_TYPE>

export class EditableShapeUtil extends BaseBoxShapeUtil<IMyEditableShape> {
    static override type = MY_PHONE_MOCKUP_SHAPE_TYPE
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
            w: 402,
            h: 874,
            animal: 0,
        }
    }

    component(shape: IMyEditableShape) {
        const isEditing = this.editor.getEditingShapeId() === shape.id

        return (
            <HTMLContainer
                id={shape.id}
                // [b]
                // onPointerDown={isEditing ? this.editor.markEventAsHandled : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    // background: '#f8fafc',
                    // border: '3px dashed #94a3b8',
                    // borderRadius: '12px',
                    // backgroundColor: 'red',
                    // padding: '16px',
                    // backgroundColor: 'transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    // padding: 16,
                }}
            >
                <img
                    src={IPHONE_MOCKUP}
                    alt="phone frame"
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: 0,
                        width: '120%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                        zIndex: 1,
                        userSelect: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '25px',      // Adjust these values to fit inside the phone screen
                        left: '8px',
                        width: '385px',   // 380 - 36px (bezel)
                        height: '825px',  // 680 - 96px (top + bottom bezel)
                        background: '#ffffff',
                        borderRadius: '60px',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
                        zIndex: 2,
                    }}>
                    <PageEditor pageId="gaming" liveMode={false}/>
                </div>
            </HTMLContainer>
        )
    }

    indicator(shape: IMyEditableShape) {
        return <rect width={shape.props.w} height={shape.props.h}/>
    }

    // [3]
    override onEditEnd(shape: IMyEditableShape) {
        this.editor.animateShape(
            {...shape, rotation: shape.rotation + Math.PI * 2},
            {animation: {duration: 250}}
        )
    }
}