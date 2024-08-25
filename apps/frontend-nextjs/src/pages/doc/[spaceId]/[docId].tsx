import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuthSSR from '@/lib/with-auth-ssr';
import { DocLayout } from '@/layouts/doc-layout';
import { apiAgentSSR } from '@/api';
import { DocPageProps } from '@/lib/page-props-type';
import DocEditor from '@/blocks/doc/doc-editor';

function Doc(props: DocPageProps) {
  return <DocEditor />;
}

export const getServerSideProps = withAuthSSR<DocPageProps>(async (context) => {
  const {
    locale,
    query: { spaceId, docId },
  } = context;

  const [userInfo, spaceList, currSpace] = await Promise.all([
    apiAgentSSR.user.getUserInfo().then(({ data }) => data),
    apiAgentSSR.space.getSpaceList().then(({ data }) => data),
    apiAgentSSR.space.getSpaceInfo({ id: spaceId as string }).then(({ data }) => data),
  ]);

  return {
    props: {
      userInfo,
      spaceList,
      currSpace,
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
});

Doc.getLayout = function getLayout(page: ReactElement, pageProps: DocPageProps) {
  return <DocLayout {...pageProps}>{page}</DocLayout>;
};

export default Doc;
