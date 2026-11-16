import { DragEvent, useEffect, useState } from "react";
import { useEditor } from "../../../../../hooks/use-editor";
import { blocks } from "../blocks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs";
import Setting from "./settings";
import ThemeBanner from "./banner";

const EditorSidebar = () => {
  const { state } = useEditor();
  const [activeTab, setActiveTab] = useState("block");

  const handleStartBlockDrag = (e: DragEvent<HTMLDivElement>, type: any) => {
    if (type == null) return;
    e.dataTransfer.setData("componentType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  useEffect(() => {
    setActiveTab(
      state.editor.selectedElement.id !== "__body" ? "setting" : "block"
    );
  }, [state.editor.selectedElement.id]);

  return (
    <aside className="flex h-full flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full flex-col"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="block" className="text-xs">
            Blocks
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">
            Layouts
          </TabsTrigger>
          <TabsTrigger value="setting" className="text-xs">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="block" className="mt-4 flex-1 overflow-y-auto">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add blocks
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {blocks
                .filter((block) => block.group === "block")
                .map((block: any) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                    className="flex cursor-grab flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-background p-3 text-center transition-colors hover:border-primary/40 hover:bg-primary/5 active:cursor-grabbing"
                  >
                    <span className="text-primary">{block.icon}</span>
                    <span className="text-[11px] font-medium text-foreground">
                      {block.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Themes
            </h3>
            <ThemeBanner />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="mt-4 flex-1 overflow-y-auto">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Layouts
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {blocks
              .filter((block) => block.group === "layout")
              .map((block: any) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleStartBlockDrag(e, block.id)}
                  className="flex cursor-grab flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-background p-3 text-center transition-colors hover:border-primary/40 hover:bg-primary/5 active:cursor-grabbing"
                >
                  <span className="text-primary">{block.icon}</span>
                  <span className="text-[11px] font-medium text-foreground">
                    {block.label}
                  </span>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="setting" className="mt-4 flex-1 overflow-y-auto">
          <Setting />
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default EditorSidebar;
