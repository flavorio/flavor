import React, { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SpaceIdPageProps } from '@/lib/page-props-type';
import withAuthSSR from '@/lib/with-auth-ssr';
import { SpaceLayout } from '@/layouts/space-layout';
import { SpaceInfo } from '@/blocks/space/space-info';
import { apiAgentSSR } from '@/api';

function SpaceId(props: SpaceIdPageProps) {
  return <SpaceInfo />;
}

export const getServerSideProps = withAuthSSR<SpaceIdPageProps>(async (context) => {
  const {
    locale,
    query: { spaceId },
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

SpaceId.getLayout = function getLayout(page: ReactElement, pageProps: SpaceIdPageProps) {
  return <SpaceLayout {...pageProps}>{page}</SpaceLayout>;
};

export default SpaceId;
