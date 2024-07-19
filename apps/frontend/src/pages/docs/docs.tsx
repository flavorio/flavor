import { throttle } from "lodash";
import { useShallow } from "zustand/react/shallow";
import { usePageStore } from "@/stores/page-store";
import DocEditor, { DocEditorProps } from "./doc-editor";

const DocsPage = () => {
  const [pageStatus, pageData, updatePageData] = usePageStore(
    useShallow((state) => [
      state.pageStatus,
      state.pageData,
      state.updatePageData,
    ]),
  );

  const onChange: DocEditorProps["onChange"] = (update) => {
    updatePageData(update);
    syncPageData();
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

const syncPageData = throttle(() => {
  const { pageId, pageData } = usePageStore.getState();
  // TODO: api request
}, 200);

export default DocsPage;
