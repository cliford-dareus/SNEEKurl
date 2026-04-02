import classNames from "classnames";
import Button from "../ui/button";
import {useEditor} from "../../hooks/use-editor";
import {useGetPageQuery} from "../../app/services/page";
import React, {useEffect, useRef} from "react";
import {BsEye} from "react-icons/bs";
import EditorPage from "./editor-components/editor-element";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {getSiteUrl} from "../../Utils/getSiteUrl";

type Props = {
    pageId: string;
    liveMode?: boolean;
}

const PageEditor = ({pageId, liveMode}: Props) => {
    const {state, dispatch} = useEditor();
    const {data, isLoading, isSuccess} = useGetPageQuery({id: pageId});

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleWheel = (e: WheelEvent) => {
            // Only stop propagation if we can actually scroll
            const canScrollVertically =
                scrollContainer.scrollHeight > scrollContainer.clientHeight;

            if (canScrollVertically) {
                e.stopPropagation();
            }
        };

        scrollContainer.addEventListener('wheel', handleWheel, {passive: true});

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);


    useEffect(() => {
        if (liveMode) {
            dispatch({type: "TOGGLE_LIVE_MODE", payload: {value: true}})
        }
    }, [liveMode, dispatch])

    useEffect(() => {
        dispatch({
            type: "LOAD_DATA",
            payload: {
                pageLinks: data?.links,
                pageId: data?.slug
            }
        })

        if (data?.content.length === 1) return
        dispatch({
            type: "LOAD_DATA",
            payload: {
                elements: data?.content ? data.content : "",
                withLive: !!liveMode
            }
        })
    }, [pageId, liveMode, dispatch])

    const handleClick = () => {
        dispatch({type: "CHANGE_SELECTED_ELEMENT", payload: {}})
    }

    const handleUnPreview = () => {
        dispatch({type: "TOGGLE_PREVIEW_MODE"})
        dispatch({type: "TOGGLE_LIVE_MODE"})
    }

    return (
        <div className={classNames(
            "h-full overflow-hidden max-w-full  overflow-x-clip bg-black text-white",
            !state.editor.previewMode && !state.editor.liveMode ? "max-h-[calc(100vh-65px)]" : "",
        )}
             onPointerDown={(e) => e.stopPropagation()}
        >
            <div
                className={classNames(
                    "use-animation-zoom-in h-full bg-muted transition-all rounded-none px-4 w-full overflow-x-hidden overflow-y-scroll flex flex-col relative",
                    {
                        "!p-0 !m-0 min-w-screen min-h-screen": state.editor.previewMode || state.editor.liveMode,
                        "overflow-y-scroll px-8": !state.editor.previewMode || !state.editor.liveMode,
                    }
                )}
                onClick={handleClick}
                ref={scrollRef}
            >
                <Button
                    onClick={handleUnPreview}
                    classnames={`absolute top-5 right-5 w-12 h-12 rounded-lg z-[500] shadow-lg flex items-center justify-center transition-all duration-300 transform 
                        ${state.editor.previewMode
                        ? "translate-x-0 opacity-100"
                        : "translate-x-20 opacity-0"
                    }
                    `}
                >
                    <BsEye className="text-red-500"/>
                </Button>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className={classNames(
                        "flex flex-col items-center text-center mb-4",
                        state.editor.device === "mobile" ? "mt-12" : "mt-24",
                    )}
                >
                    <div className="relative mb-6">
                        <div
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 p-1">
                            <img
                                src="https://picsum.photos/seed/profile/400/400"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <motion.div
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            transition={{delay: 0.5, type: "spring"}}
                            className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black"
                        />
                    </div>

                    <h1 className="text-4xl text-white md:text-5xl font-serif font-bold tracking-tight mb-2">
                        @{data?.user.username}
                    </h1>
                    <p className="text-white/60 text-sm md:text-base font-light tracking-wide max-w-xs md:max-w-md">
                        {data?.description}
                    </p>

                    <div className="mt-2 flex gap-2">
                        {data?.links?.map(({_id: link, category}: any) => {
                            if (category === "social")
                                return (
                                    <div
                                        key={link._id}
                                        className="w-[50px] h-[50px] rounded-full border overflow-hidden group block  bg-white/5  border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                        <Link to={link.short} target="_blank">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={`https://www.google.com/s2/favicons?domain=${getSiteUrl(
                                                    link.longUrl
                                                )}`}
                                            />
                                        </Link>
                                    </div>
                                );
                        })}
                    </div>
                </motion.div>

                <div className="flex flex-col items-center w-full">
                    {Array.isArray(state.editor.elements) &&
                        state.editor.elements.map((childElement, index: number) => {
                            return <EditorPage key={index} element={childElement}/>
                        })}
                </div>

                <motion.footer
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 1}}
                    className="mt-auto pt-8 border-t border-white/5 w-full text-center"
                >
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium">
                        © 2026 {data?.user?.username} — Built with SneekInk
                    </p>
                </motion.footer>
            </div>
        </div>
    );
};

export default PageEditor;