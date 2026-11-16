import { useParams } from "react-router-dom";
import { useGetPageQuery } from "../app/services/page";
import React from "react";
import EditorProvider from "../hooks/use-editor";
import PageEditor from "../components/editor";
import EditorSidebar from "../components/editor/editor-components/editor-ui/editor-sidebar/editor-sidebar";
import EditorTopbar from "../components/editor/editor-components/editor-ui/editor-topbar";

const ManagePage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetPageQuery({ id });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading page editor...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <p className="text-sm text-destructive">Failed to load page.</p>
      </div>
    );
  }

  return (
    <EditorProvider pageId={data.slug} pageDetails={data}>
      <div className="flex h-[calc(100vh-140px)] gap-6">
        {/* Phone preview */}
        <div className="relative flex flex-1 items-start justify-center overflow-hidden rounded-xl border border-border bg-muted/30 p-6">
          <div className="absolute left-4 top-4 z-10">
            <EditorTopbar />
          </div>

          {/* Simple phone frame */}
          <div className="relative mt-16 w-[390px] shrink-0 overflow-hidden rounded-[40px] border-[10px] border-foreground/90 bg-background shadow-2xl">
            <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
            <div className="h-[780px] overflow-hidden rounded-[30px]">
              <PageEditor pageId={data.slug} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[280px] shrink-0 overflow-y-auto rounded-xl border border-border bg-card p-3">
          <EditorSidebar />
        </div>
      </div>
    </EditorProvider>
  );
};

export default ManagePage;
