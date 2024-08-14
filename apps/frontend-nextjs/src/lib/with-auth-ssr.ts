import type { GetServerSideProps } from 'next';
import { apiAgentSSR } from '@/api/api-agent';

export default function withAuthSSR<P extends { [key: string]: any }>(
  handler: GetServerSideProps<P>,
): GetServerSideProps {
  return async (ctx) => {
    const req = ctx.req;
    apiAgentSSR.instance.defaults.headers['cookie'] = req.headers.cookie || '';
    try {
      return await handler(ctx);
    } catch (err: any) {
      const status = err.response.status;
      if (status === 401) {
        return {
          redirect: {
            destination: `/login?redirect=${encodeURIComponent(req.url!)}`,
            permanent: false,
          },
        };
      }
      if (status === 402) {
        return {
          redirect: {
            destination: `/402`,
            permanent: false,
          },
        };
      }
      if (status === 403) {
        return {
          redirect: {
            destination: `/403`,
            permanent: false,
          },
        };
      }
      if (status == 404) {
        return {
          notFound: true,
        };
      }
      console.error(err);
      throw err;
    }
  };
}
