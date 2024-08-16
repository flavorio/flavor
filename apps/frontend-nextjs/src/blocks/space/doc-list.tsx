import React from 'react';
import { Document } from '@/stores/store-type';
import { useRouter } from 'next/router';

type Props = {
  documents: Document[];
};

export function DocList(props: Props) {
  const { documents } = props;
  const router = useRouter();

  const handleDocClick = (doc: Document) => {
    const { id, spaceId } = doc;
    const url = `/doc/${spaceId}/${id}`;
    router.push(url);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-3">
      {documents.map((doc) => (
        <div
          className="rounded-xl border bg-card text-card-foreground shadow group cursor-pointer hover:shadow-md h-24 min-w-[17rem] max-w-[34rem] flex-1"
          onClick={() => handleDocClick(doc)}
          key={doc.id}
        >
          <div className="p-6 flex size-full items-center gap-3 px-4 py-6">{doc.name}</div>
        </div>
      ))}
    </div>
  );
}
