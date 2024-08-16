import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { FileIcon } from '@radix-ui/react-icons';
import { cn, Input } from '@flavor/ui';
import { apiAgent } from '@/api';
import { Document } from '@/stores/store-type';
import { currSpaceAtomWithImmer } from '@/stores/space-atoms';
import DocOperation from './doc-operation';
import { useAtom } from 'jotai';

type DocItemProps = {
  doc: Document;
  editingId: string;
  setEditingId: React.Dispatch<string>;
};
export default function DocItem(props: DocItemProps) {
  const { doc, editingId, setEditingId } = props;
  const router = useRouter();
  const pageId = router.query.docId;
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = doc.id === editingId;
  const [, setSpace] = useAtom(currSpaceAtomWithImmer);

  const updateDocName = (docId: string, docName: string) => {
    setSpace((draft) => {
      const doc = draft?.documents.find((doc) => doc.id === docId);
      if (doc) {
        doc.name = docName;
      }
    });
  };

  const openDoc = (docId: string) => () => {
    router.push(`/doc/${doc.spaceId}/${docId}`);
  };

  const syncDocName = async (name: string) => {
    updateDocName(doc.id, name);
    await apiAgent.document.updateDocument({ id: doc.id, name });
    setEditingId('');
  };

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus());
    }
  }, [isEditing]);

  return (
    <li
      className={cn(
        'flex items-center gap-2 h-7 px-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm',
        {
          'bg-secondary/90': doc.id === pageId,
        },
      )}
    >
      {editingId === doc.id ? (
        <Input
          ref={inputRef}
          type="text"
          placeholder="name"
          defaultValue={doc.name}
          style={{
            boxShadow: 'none',
          }}
          className="h-6 round-none cursor-text bg-background px-4 outline-none"
          onBlur={(e) => {
            if (e.target.value && e.target.value !== doc.name) {
              syncDocName(e.target.value);
            }
            setEditingId('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.currentTarget.value && e.currentTarget.value !== doc.name) {
                syncDocName(e.currentTarget.value);
              }
              setEditingId('');
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
      ) : (
        <>
          <FileIcon />
          <span className="grow truncate" onClick={openDoc(doc.id)}>
            {doc.name}
          </span>
          <DocOperation doc={doc} onRename={() => setEditingId(doc.id)} />
        </>
      )}
    </li>
  );
}
