import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiAgent } from '@/api';
import { useIntl, FormattedMessage, Link, useLocation, useNavigate } from 'umi';
import { signupSchema, SignupRo } from '@flavor/core/data';
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

export default function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const emailDesc = intl.formatMessage({
    id: 'user.email',
  });
  const passwordDesc = intl.formatMessage({
    id: 'user.password',
  });

  const form = useForm<SignupRo>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignupRo) {
    await apiAgent.auth.signup(values);
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4">
            <Button type="submit">
              <FormattedMessage id="auth.signUp" />
            </Button>
            <Link to="/login" state={location.state} replace className="ml-4">
              <FormattedMessage id="auth.redirectToSignInDesc" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
