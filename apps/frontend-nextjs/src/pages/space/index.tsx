import React, { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useHydrateAtoms } from 'jotai/utils';
import { apiAgentSSR } from '@/api';
import withAuthSSR from '@/lib/with-auth-ssr';
import { SpacePageProps } from '@/lib/page-props-type';
import { spaceListAtom } from '@/stores/space-atoms';
import { userAtom } from '@/stores/user-atoms';
import { SpaceLayout } from '@/layouts/space-layout';
import { AllSpace } from '@/blocks/space/all-spaces';

function Space(props: SpacePageProps) {
  const { userInfo, spaceList } = props;

  useHydrateAtoms([
    [userAtom, userInfo],
    [spaceListAtom, spaceList],
  ]);

  return <AllSpace />;
}

export const getServerSideProps = withAuthSSR<SpacePageProps>(async (context) => {
  const { locale } = context;

  const [userInfo, spaceList] = await Promise.all([
    apiAgentSSR.user.getUserInfo().then(({ data }) => data),
    apiAgentSSR.space.getSpaceList().then(({ data }) => data),
  ]);

  return {
    props: {
      userInfo,
      spaceList,
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
});

Space.getLayout = function getLayout(page: ReactElement, pageProps: SpacePageProps) {
  return <SpaceLayout {...pageProps}>{page}</SpaceLayout>;
};

export default Space;
