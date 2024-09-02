import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { apiAgent } from '@/api';
import { signupSchema, SignupRo } from '@flavor/core';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@flavor/ui/shadcn';

type Props = {
  /** Add props here */
};

export default function SignUp() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const emailDesc = t('user.email');
  const passwordDesc = t('user.password');

  const form = useForm<SignupRo>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignupRo) {
    await apiAgent.auth.signup(values);
    const { next } = router.query;
    const url = next === undefined || Array.isArray(next) ? '/' : next;
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4">
            <Button type="submit">{t('auth.signUp')}</Button>
            <Link
              href={{
                pathname: '/login',
                query: router.query,
              }}
              replace
              className="ml-4"
            >
              {t('auth.redirectToSignInDesc')}
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
