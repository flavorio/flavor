import React, { useEffect, useRef } from "react";
import { FileIcon } from "@radix-ui/react-icons";
import { Input } from "@flavor/ui/shadcn";
import { Document } from "@/stores/space-store";
import { apiAgent } from "@/api";
import DocOperation from "./doc-operation";

type DocItemProps = {
  doc: Document;
  editingId: string;
  setEditingId: React.Dispatch<string>;
};
export default function DocItem(props: DocItemProps) {
  const { doc, editingId, setEditingId } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = doc.id === editingId;

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus());
    }
  }, [isEditing]);

  return (
    <li className="flex items-center gap-2 h-7 px-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
      {editingId === doc.id ? (
        <Input
          ref={inputRef}
          type="text"
          placeholder="name"
          defaultValue={doc.name}
          style={{
            boxShadow: "none",
          }}
          className="h-6 round-none cursor-text bg-background px-4 outline-none"
          onBlur={(e) => {
            if (e.target.value && e.target.value !== doc.name) {
              // api request
            }
            setEditingId("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.currentTarget.value && e.currentTarget.value !== doc.name) {
                // api request
              }
              setEditingId("");
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      ) : (
        <>
          <FileIcon />
          <span className="grow truncate">{doc.name}</span>
          <DocOperation doc={doc} onRename={() => setEditingId(doc.id)} />
        </>
      )}
    </li>
  );
}
