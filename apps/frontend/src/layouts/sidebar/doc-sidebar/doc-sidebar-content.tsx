import { FormattedMessage } from "umi";
import { useShallow } from "zustand/react/shallow";
import { FilePlusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useSpaceStore } from "@/stores/space-store";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@flavor/ui/shadcn";
import { apiAgent } from "@/api";
import { useState } from "react";
import DocItem from "./doc-item";

export default function DocSidebarContent() {
  const [editingId, setEditingId] = useState("");
  const [currSpaceInfo, spaceList, setCurrSpaceId, getSpaceInfo] =
    useSpaceStore(
      useShallow((state) => [
        state.currSpaceInfo,
        state.spaceList,
        state.setCurrSpaceId,
        state.getSpaceInfo,
      ]),
    );

  const addDoc = async () => {
    const payload = {
      name: "new doc",
      spaceId: currSpaceInfo?.id!,
      doc: createDoc(),
    };
    apiAgent.document.createDocument(payload);
    await getSpaceInfo();
  };

  return (
    <div className="flex w-full flex-col gap-2 overflow-auto pt-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="px-2">
            <Button variant={"outline"} size={"sm"} className={`w-full`}>
              <PlusIcon />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuItem onClick={addDoc} className="cursor-pointer">
            <Button variant="ghost" size="sm" className="h-4">
              <FilePlusIcon className="size-4 mr-2" />
              <FormattedMessage id="doc.createANewDoc" />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ul className="mx-2">
        {currSpaceInfo?.documents.map((doc) => (
          <DocItem
            key={doc.id}
            doc={doc}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
      </ul>
    </div>
  );
}

const createDoc = () => {
  return {
    store: {
      "document:document": {
        gridSize: 10,
        name: "",
        meta: {},
        id: "document:document",
        typeName: "document",
      },
      "page:page": {
        meta: {},
        id: "page:page",
        name: "Page 1",
        index: "a1",
        typeName: "page",
      },
      "shape:f4LKGB_8M2qsyWGpHR5Dq": {
        x: 30.9375,
        y: 69.48828125,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:f4LKGB_8M2qsyWGpHR5Dq",
        type: "container",
        parentId: "page:page",
        index: "a1",
        props: {
          width: 644,
          height: 148,
        },
        typeName: "shape",
      },
    },
    schema: {
      schemaVersion: 2,
      sequences: {
        "com.tldraw.store": 4,
        "com.tldraw.asset": 1,
        "com.tldraw.camera": 1,
        "com.tldraw.document": 2,
        "com.tldraw.instance": 25,
        "com.tldraw.instance_page_state": 5,
        "com.tldraw.page": 1,
        "com.tldraw.instance_presence": 5,
        "com.tldraw.pointer": 1,
        "com.tldraw.shape": 4,
        "com.tldraw.asset.bookmark": 2,
        "com.tldraw.asset.image": 4,
        "com.tldraw.asset.video": 4,
        "com.tldraw.shape.group": 0,
        "com.tldraw.shape.text": 2,
        "com.tldraw.shape.bookmark": 2,
        "com.tldraw.shape.draw": 2,
        "com.tldraw.shape.geo": 9,
        "com.tldraw.shape.note": 7,
        "com.tldraw.shape.line": 5,
        "com.tldraw.shape.frame": 0,
        "com.tldraw.shape.arrow": 5,
        "com.tldraw.shape.highlight": 1,
        "com.tldraw.shape.embed": 4,
        "com.tldraw.shape.image": 3,
        "com.tldraw.shape.video": 2,
        "com.tldraw.shape.container": 0,
        "com.tldraw.shape.element": 0,
        "com.tldraw.binding.arrow": 0,
        "com.tldraw.binding.layout": 0,
      },
    },
  };
};
