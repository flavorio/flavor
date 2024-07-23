import { throttle } from "lodash";
import { useShallow } from "zustand/react/shallow";
import { usePageStore } from "@/stores/page-store";
import { UpdatesRo } from "@flavor/core/data";
import { apiAgent } from "@/api";
import DocEditor, { DocEditorProps } from "./doc-editor";

const DocsPage = () => {
  const [pageId, pageStatus, pageData, updatePageData] = usePageStore(
    useShallow((state) => [
      state.pageId,
      state.pageStatus,
      state.pageData,
      state.updatePageData,
    ]),
  );

  const onChange: DocEditorProps["onChange"] = (update) => {
    updatePageData(update);
    syncPageData(pageId, update);
  };

  return (
    <div className="w-full h-full">
      {pageStatus === "loading" && "loading"}
      {pageStatus === "failed" && "failed"}
      {pageStatus === "succeed" && (
        <DocEditor defaultData={pageData} onChange={onChange} />
      )}
    </div>
  );
};

const updatesCache: Record<string, UpdatesRo[]> = {};

const syncPageData = (pageId: string, update: UpdatesRo) => {
  if (!updatesCache[pageId]) updatesCache[pageId] = [];
  updatesCache[pageId].push(update);
  sendPageData(pageId);
};

const sendPageData = throttle((pageId: string) => {
  const updates = updatesCache[pageId];
  updatesCache[pageId] = [];
  apiAgent.document.updateDocumentRecords({
    id: pageId,
    updates,
  });
}, 200);

export default DocsPage;
