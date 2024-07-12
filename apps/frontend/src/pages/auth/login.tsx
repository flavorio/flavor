import { Button, Form, FormProps, Input } from "antd";
import { FormattedMessage, Link, useIntl, useLocation, useNavigate } from "umi";
import { apiAgent } from "@/api/api-agent";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const emailDesc = intl.formatMessage({
    id: "user.email",
  });
  const passwordDesc = intl.formatMessage({
    id: "user.password",
  });

  const onFinish: FormProps<SigninPayload>["onFinish"] = async (values) => {
    await apiAgent.auth.signin(values);
    const from = location.state?.from?.pathname;
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
        <Form.Item<SigninPayload>
          label={emailDesc}
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<SigninPayload>
          label={passwordDesc}
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="auth.signIn" />
          </Button>
          <Link to="/signup" replace>
            <FormattedMessage id="auth.redirectToSignUpDesc" />
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}
