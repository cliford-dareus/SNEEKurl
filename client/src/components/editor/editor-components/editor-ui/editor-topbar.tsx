import React, { useState } from "react";
import { Button } from "../../../ui/button";
import { useEditor } from "../../../../hooks/use-editor";
import { useUpdatePageMutation } from "../../../../app/services/page";
import { toast } from "react-toastify";
import { LuSave } from "react-icons/lu";

const EditorTopbar = () => {
  const { state } = useEditor();
  const [upsertPage, { isLoading }] = useUpdatePageMutation();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!state.editor.id) {
      toast.error("Page not loaded yet");
      return;
    }

    try {
      await upsertPage({
        id: state.editor.id,
        content: JSON.stringify(state.editor.elements),
        theme: JSON.stringify(state.editor.theme),
      }).unwrap();

      toast.success("Page saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save page");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={handleSave}
        disabled={isLoading || !state.editor.id}
        className="gap-1.5"
      >
        {isLoading ? (
          <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
        ) : (
          <LuSave size={14} />
        )}
        {isLoading ? "Saving..." : saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
};

export default EditorTopbar;
