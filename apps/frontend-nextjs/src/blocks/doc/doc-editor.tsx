import 'tldraw/tldraw.css';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useSync } from '@tldraw/sync';
import {
  AssetRecordType,
  getHashForString,
  TLAssetStore,
  TLBookmarkAsset,
  Tldraw,
  uniqueId,
} from 'tldraw';
import { userAtom } from '@/stores/user-atoms';
import { getRandomString } from '@flavor/core';

// const WORKER_URL = `ws://localhost`;
const WORKER_URL = `ws://localhost:10008`;

const DocEditor = () => {
  const userInfo = useAtomValue(userAtom);
  const router = useRouter();
  const docId = router.query.docId;
  const sessionId = getRandomString(16);
  const store = useSync({
    // We need to know the websocket's URI...
    uri: `${WORKER_URL}/realtime?roomId=${docId}`,
    userInfo: {
      id: userInfo!.id,
      name: userInfo?.name,
    },
    // ...and how to handle static assets like images & videos
    assets: multiplayerAssets,
  });

  return (
    <div
      className="w-full h-full"
      // style={{ position: 'fixed', inset: 0 }}
    >
      <Tldraw
        // we can pass the connected store into the Tldraw component which will handle
        // loading states & enable multiplayer UX like cursors & a presence menu
        store={store}
        onMount={(editor) => {
          // when the editor is ready, we need to register out bookmark unfurling service
          editor.registerExternalAssetHandler('url', unfurlBookmarkUrl);
        }}
      />
    </div>
  );
};

const multiplayerAssets: TLAssetStore = {
  // to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
  async upload(_asset, file) {
    const id = uniqueId();

    const objectName = `${id}-${file.name}`;
    const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`;

    const response = await fetch(url, {
      method: 'PUT',
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`);
    }

    return url;
  },
  // to retrieve an asset, we can just use the same URL. you could customize this to add extra
  // auth, or to serve optimized versions / sizes of the asset.
  resolve(asset) {
    return asset.props.src;
  },
};

// How does our server handle bookmark unfurling?
async function unfurlBookmarkUrl({ url }: { url: string }): Promise<TLBookmarkAsset> {
  const asset: TLBookmarkAsset = {
    id: AssetRecordType.createId(getHashForString(url)),
    typeName: 'asset',
    type: 'bookmark',
    meta: {},
    props: {
      src: url,
      description: '',
      image: '',
      favicon: '',
      title: '',
    },
  };

  try {
    const response = await fetch(`${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    asset.props.description = data?.description ?? '';
    asset.props.image = data?.image ?? '';
    asset.props.favicon = data?.favicon ?? '';
    asset.props.title = data?.title ?? '';
  } catch (e) {
    console.error(e);
  }

  return asset;
}

export default DocEditor;
