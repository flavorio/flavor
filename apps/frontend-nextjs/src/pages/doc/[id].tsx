import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuthSSR from '@/lib/with-auth-ssr';
import { apiAgentSSR } from '@/api';

type Props = {
  /** Add props here */
};

export default function Doc() {
  return <div>Doc</div>;
}

export const getServerSideProps: GetServerSideProps<Props> = withAuthSSR(async (context) => {
  const { locale } = context;

  const data = await apiAgentSSR.space.getSpaceList().then(({ data }) => data);

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
});
