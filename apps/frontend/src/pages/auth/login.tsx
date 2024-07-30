import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormattedMessage, Link, useIntl, useLocation, useNavigate } from 'umi';
import { apiAgent } from '@/api/api-agent';
import { signinSchema, SigninRo } from '@flavor/core/data';
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

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const emailDesc = intl.formatMessage({
    id: 'user.email',
  });
  const passwordDesc = intl.formatMessage({
    id: 'user.password',
  });

  const form = useForm<SigninRo>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SigninRo) {
    await apiAgent.auth.signin(values);
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
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
            <Button type="submit">
              <FormattedMessage id="auth.signIn" />
            </Button>
            <Link to="/signup" state={location.state} replace className="ml-4">
              <FormattedMessage id="auth.redirectToSignUpDesc" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
