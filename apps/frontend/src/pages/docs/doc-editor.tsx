import { useEffect } from "react";
import { HistoryEntry, loadSnapshot, Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";

type OnChange = (update: HistoryEntry) => void;

export type DocEditorProps = {
  defaultData: any;
  onChange?: OnChange;
};

export default function DocEditor(props: DocEditorProps) {
  const { defaultData, onChange } = props;

  return (
    <>
      <Tldraw>
        <InsideOfContext defaultData={defaultData} onChange={onChange} />
      </Tldraw>
    </>
  );
}

function InsideOfContext(props: DocEditorProps) {
  const { defaultData, onChange } = props;
  const editor = useEditor();

  const unlisten = editor.store.listen(
    (update) => {
      onChange?.(update);
    },
    { scope: "document", source: "user" },
  );

  useEffect(() => {
    loadSnapshot(editor.store, defaultData);
  }, []);

  return null;
}
