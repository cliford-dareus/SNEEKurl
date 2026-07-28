import classNames from "classnames";
import { useEditor } from "../../hooks/use-editor";
import { useGetPageQuery } from "../../app/services/page";
import React, { useEffect, useRef } from "react";
import { BsEye } from "react-icons/bs";
import EditorPage from "./editor-components/editor-element";
import { backIn, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getSiteUrl } from "../../Utils/getSiteUrl";
import { Button } from "../ui/button";
import { LuMenu, LuSettings2, LuSparkles } from "react-icons/lu";

type Props = {
    pageId: string;
    liveMode?: boolean;
}

const PageEditor = ({ pageId, liveMode }: Props) => {
    const { state, dispatch } = useEditor();
    const { data, isLoading, isSuccess } = useGetPageQuery({ id: pageId });

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

        scrollContainer.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);

    useEffect(() => {
        if (liveMode) {
            dispatch({ type: "TOGGLE_LIVE_MODE", payload: { value: true } })
        }
    }, [liveMode, dispatch])

    // Load data on pageId change
    useEffect(() => {
        dispatch({
            type: "LOAD_DATA",
            payload: {
                elements: data?.content ? JSON.parse(data.content) : "",
                theme: data?.theme ? JSON.parse(data.theme) : null,
                withLive: !!liveMode,
                id: data?._id,
                pageLinks: data?.links,
                pageId: data?.slug,
            }
        })
    }, [pageId, liveMode, dispatch])

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        dispatch({ type: "CHANGE_SELECTED_ELEMENT", payload: {} })
    };

    const handleUnPreview = () => {
        dispatch({ type: "TOGGLE_PREVIEW_MODE" })
        dispatch({ type: "TOGGLE_LIVE_MODE" })
    };

    const getBackgroundStyle = () => {
        if (data?.backgroundType === 'image' && data?.backgroundImageUrl) {
            return {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data?.backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            };
        }
        if (data?.backgroundType === 'gradient') {
            return { background: data?.backgroundGradient };
        }
        return { backgroundColor: data?.backgroundColor };
    };
    
    console.log(state.editor.theme);

    return (
        <div className={classNames(
            "h-screen max-w-full  overflow-clip bg-black text-white",
            !state.editor.previewMode && !state.editor.liveMode ? "max-h-[calc(100vh-65px)]" : "",
        )}
            onClick={handleClick}
            onPointerDown={(e) => e.stopPropagation()}
        >
            {/* Main Link-in-Bio Canvas (Device Styled) */}
            <div className={classNames(
                "use-animation-zoom-in h-full bg-black transition-all rounded-none w-full overflow-x-hidden flex flex-col relative no-scrollbar",
                {
                    "!p-0 !m-0 min-w-screen min-h-screen": state.editor.previewMode || state.editor.liveMode,
                    "overflow-y-scroll": !state.editor.previewMode || !state.editor.liveMode,
                }
            )}
                ref={scrollRef}
            >
                <div>
                    {/* Top Banner (Mesh Gradient Visual Block matching image) */}
                    <div
                        className="relative w-full h-[220px] md:h-[260px] flex flex-col justify-between overflow-hidden"
                        style={{
                            background: state.editor.theme?.backgroundGradient,
                            backgroundSize: state.editor.theme?.backgroundSize ? state.editor.theme.backgroundSize : '',
                        }}
                    >
                        {/* Ambient Glowing Blobs to emulate modern SaaS mesh layout inside photo */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-90 select-none">
                            <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[130%] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.35)_0%,transparent_70%)] blur-2xl animate-pulse" />
                            <div className="absolute top-[10%] right-[-10%] w-[70%] h-[120%] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.5)_0%,transparent_60%)] blur-3xl opacity-80" />
                            <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.35)_0%,transparent_70%)] blur-2xl" />
                        </div>

                        {/* Nav Header (Menu + Logo matching image) */}
                        <div className="w-full flex items-center justify-between px-6 py-5 z-10 relative">
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-white/10 backdrop-blur-md">
                                    <LuSparkles className="w-5 h-5 text-indigo-300 drop-shadow-md" />
                                </div>
                                <span className="font-bold text-lg tracking-tight text-white drop-shadow-md font-sans">
                                    {state.editor.theme?.headerBrandName || "SmartBio"}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all text-white flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer z-20"
                            >
                                <LuMenu className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Curved Wave Mask Transition (Convex Shape matching image) */}
                        <div
                            className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-[0] pointer-events-none z-10 transition-colors duration-500"
                            style={{ fill: state.editor.theme?.backgroundColor }}
                        >
                            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-full h-[55px] md:h-[75px]">
                                <path d="M0,120 Q720,20 1440,120 L1440,120 L0,120 Z" />
                            </svg>
                        </div>
                    </div>

                    {/* Content Body Space */}
                    <div className="pb-10 flex-1 flex flex-col items-center">
                        {/* Overlapping Avatar Area (Intersecting curved line) */}
                        <div className="relative flex flex-col items-center z-20 mt-[-40px] md:mt-[-55px] mb-6">
                            <div className="relative group">
                                <div
                                    className="w-24 h-24 md:w-32 bg-slate-400 md:h-32 rounded-full overflow-hidden ring-[8px] p-0.5 shadow-xl transition-all duration-500 hover:scale-105"
                                    style={{
                                        backgroundColor: state.editor.theme?.backgroundColor,
                                        borderColor: `${state.editor.theme?.accentColor}10`,
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                                        // Simple hack to apply dynamic background ring
                                        outline: `8px solid ${state.editor.theme?.backgroundColor}`
                                    }}
                                >
                                    <img
                                        src={data?.avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover transition-all duration-500"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    style={{
                                        backgroundColor: state.editor.theme?.themeColor,
                                        borderColor: state.editor.theme?.backgroundColor,
                                        borderWidth: "3px"
                                    }}
                                    className="absolute bottom-1 right-1 w-5 h-5 rounded-full shadow-md"
                                />
                            </div>
                        </div>

                        {/* Profile Name & Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col items-center text-center mb-10 max-w-md w-full"
                        >
                            <h1
                                className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight mb-3 transition-colors duration-500"
                                style={{ color: data?.accentColor }}
                            >
                                {data?.user.username}
                            </h1>
                            <p
                                className="text-sm md:text-base leading-relaxed tracking-wide opacity-80"
                                style={{ color: data?.textColor }}
                            >
                                {data?.description}
                            </p>
                        </motion.div>

                        {/* Links Section */}
                        <div className="flex flex-col items-center w-full">
                            {Array.isArray(state.editor.elements) &&
                                state.editor.elements.map((childElement, index: number) => {
                                    return <EditorPage key={index} element={childElement} />
                                })}
                        </div>

                        {/* Footer */}
                        <motion.footer
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-auto pt-8 border-t border-neutral-200/10 w-full text-center max-w-md"
                        >
                            <p
                                className="text-[10px] uppercase tracking-[0.25em] font-semibold opacity-40"
                                style={{ color: state.editor.theme?.textColor }}
                            >
                                © 2026 {data?.user?.username} — Powered by {data?.headerBrandName}
                            </p>
                        </motion.footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageEditor;
