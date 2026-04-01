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
            pageId: string
        }
    }
}

export type IPhoneMockupShape = TLShape<typeof MY_PHONE_MOCKUP_SHAPE_TYPE>

export class EditableShapeUtil extends BaseBoxShapeUtil<IPhoneMockupShape> {
    static override type = MY_PHONE_MOCKUP_SHAPE_TYPE
    static override props: RecordProps<IPhoneMockupShape> = {
        w: T.number,
        h: T.number,
        pageId: T.string,
    }

    // [1]
    override canEdit() {
        return true
    }

    // [1b]
    override canEditWhileLocked() {
        return true
    }

    getDefaultProps(): IPhoneMockupShape['props'] {
        return {
            w: 402,
            h: 874,
            pageId: "",
        }
    }

    component(shape: IPhoneMockupShape) {
        const isEditing = this.editor.getEditingShapeId() === shape.id

        return (
            <HTMLContainer
                id={shape.id}
                // [b]
                // onPointerDown={isEditing ? this.editor.markEventAsHandled : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    position: 'relative',
                    overflow: 'hidden',
                    userSelect: 'none',
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
                        top: '25px',
                        left: '8px',
                        width: '385px',
                        height: '825px',
                        background: '#ffffff',
                        borderRadius: '60px',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
                        zIndex: 2,
                    }}>
                    <PageEditor pageId={shape.props.pageId} liveMode={false}/>
                </div>
            </HTMLContainer>
        )
    }

    indicator(shape: IPhoneMockupShape) {
        return <rect width={shape.props.w} height={shape.props.h}/>
    }

    // [3]
    override onEditEnd(shape: IPhoneMockupShape) {
        this.editor.animateShape(
            {...shape, rotation: shape.rotation + Math.PI * 2},
            {animation: {duration: 250}}
        )
    }
}