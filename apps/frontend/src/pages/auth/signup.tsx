import { apiAgent } from "@/api";
import { Button, Form, FormProps, Input } from "antd";
import { useIntl, FormattedMessage, Link, useLocation, useNavigate } from "umi";

export default function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const email = intl.formatMessage({
    id: "user.email",
  });
  const password = intl.formatMessage({
    id: "user.password",
  });

  const onFinish: FormProps<SignupPayload>["onFinish"] = async (values) => {
    const { email, password } = values;
    await apiAgent.auth.signup({ email, password });
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<SignupPayload>
          label={email}
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<SignupPayload>
          label={password}
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="auth.signUp" />
          </Button>
          <Link to="/login" replace>
            <FormattedMessage id="auth.redirectToSignInDesc" />
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}
