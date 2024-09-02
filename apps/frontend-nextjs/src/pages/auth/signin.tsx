import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { apiAgent } from '@/api/api-agent';
import { signinSchema, SigninRo } from '@flavor/core';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@flavor/ui';

type Props = {
  /** Add props here */
};

export default function SignIn() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const emailDesc = t('user.email');
  const passwordDesc = t('user.password');

  const form = useForm<SigninRo>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SigninRo) {
    await apiAgent.auth.signin(values);
    const { redirect } = router.query;
    const url = redirect === undefined || Array.isArray(redirect) ? '/' : redirect;
    router.replace(url);
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/12">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{emailDesc}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{passwordDesc}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4">
            <Button type="submit">{t('auth.signIn')}</Button>
            <Link
              href={{
                pathname: '/signup',
                query: router.query,
              }}
              replace
              className="ml-4"
            >
              {t('auth.redirectToSignUpDesc')}
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
  };
};
