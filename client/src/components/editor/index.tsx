import classNames from "classnames";
import { useEditor } from "../../hooks/use-editor";
import { useGetPageQuery } from "../../app/services/page";
import React, { useEffect, useRef } from "react";
import EditorPage from "./editor-components/editor-element";
import { motion } from "framer-motion";
import { LuSparkles } from "react-icons/lu";

type Props = {
  pageId: string;
  liveMode?: boolean;
};

const PageEditor = ({ pageId, liveMode }: Props) => {
  const { state, dispatch } = useEditor();
  const { data, isSuccess } = useGetPageQuery({ id: pageId });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const canScrollVertically =
        scrollContainer.scrollHeight > scrollContainer.clientHeight;
      if (canScrollVertically) {
        e.stopPropagation();
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (liveMode) {
      dispatch({ type: "TOGGLE_LIVE_MODE" });
    }
  }, [liveMode, dispatch]);

  // Load data only when the query has succeeded
  useEffect(() => {
    if (!isSuccess || !data) return;

    let elements = state.editor.elements;
    try {
      if (data.content) {
        const parsed = JSON.parse(data.content);
        if (Array.isArray(parsed)) elements = parsed;
      }
    } catch {
      // keep default
    }

    let theme = state.editor.theme;
    try {
      if (data.theme) {
        theme = JSON.parse(data.theme);
      }
    } catch {
      // keep default
    }

    dispatch({
      type: "LOAD_DATA",
      payload: {
        elements,
        theme,
        withLive: !!liveMode,
        id: data._id,
        pageLinks: data.links || [],
        pageId: data.slug,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data?._id, liveMode]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: {
        elementDetails: {
          content: [],
          id: "__body",
          name: "Body",
          styles: {},
          type: "__body",
          category: "Container",
        },
      },
    });
  };

  return (
    <div
      className={classNames(
        "flex h-full flex-col overflow-hidden bg-background text-foreground",
        state.editor.liveMode && "bg-black text-white"
      )}
      onClick={handleClick}
    >
      {/* Banner */}
      <div
        className="relative flex h-[140px] w-full flex-col justify-between overflow-hidden"
        style={{
          background:
            state.editor.theme?.backgroundGradient ||
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute left-[-10%] top-[-30%] h-[130%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.4)_0%,transparent_70%)] blur-2xl" />
          <div className="absolute right-[-10%] top-[10%] h-[120%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.45)_0%,transparent_60%)] blur-3xl" />
        </div>

        <div className="relative z-10 flex w-full items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-white/15 p-1 backdrop-blur-sm">
              <LuSparkles className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white drop-shadow-sm">
              {state.editor.theme?.headerBrandName || "SNEEK"}
            </span>
          </div>
        </div>

        <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="block h-10 w-full"
            style={{ fill: state.editor.theme?.backgroundColor || "#ffffff" }}
          >
            <path d="M0,80 Q720,10 1440,80 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* Avatar + name */}
      <div className="relative z-10 -mt-10 flex flex-col items-center px-4 pb-2">
        <div
          className="size-20 overflow-hidden rounded-full border-4 shadow-lg"
          style={{
            borderColor: state.editor.theme?.backgroundColor || "#ffffff",
          }}
        >
          <img
            src={data?.avatarUrl || "https://via.placeholder.com/160"}
            alt=""
            className="size-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center"
        >
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: data?.accentColor || "inherit" }}
          >
            {data?.user?.username || "Your Name"}
          </h1>
          {data?.description && (
            <p
              className="mt-1 max-w-[280px] text-xs leading-relaxed opacity-80"
              style={{ color: data?.textColor || "inherit" }}
            >
              {data.description}
            </p>
          )}
        </motion.div>
      </div>

      {/* Blocks canvas */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div className="flex min-h-full flex-col items-center px-4 pb-8 pt-2">
          {Array.isArray(state.editor.elements) &&
            state.editor.elements.map((childElement, index) => (
              <EditorPage key={childElement.id || index} element={childElement} />
            ))}

          <div className="mt-auto w-full max-w-md pt-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">
              Powered by SNEEK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
