"use client";

import { loginService, logOutService } from "@/services/auth";
import {
  AntDesignOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Input,
  App,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

const { Title, Text } = Typography;

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const DEMO_CREDENTIALS = { email: "admin@demo.com", password: "demo1234" };

const LoginForm = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [isLoading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const response = await loginService(values);

      if (response.message !== "Success") return;

      const targetApp = response.data?.user?.target_apps?.[0];
      const refreshToken = response?.data?.jwt?.refresh;

      // Non CMS user
      if (targetApp !== "cms") {
        message.error("You don’t have access to the CMS application.");

        const tempSession = {
          csrf: response.data.csrf,
          jwt: response.data.jwt,
          user: response.data.user,
        };

        Cookies.set("ava_cms_session", JSON.stringify(tempSession), {
          expires: 1 / 24,
          ...(!isDemo && { secure: true, sameSite: "Strict" }),
        });

        try {
          await logOutService({ refresh: refreshToken });
        } catch (e) {
          console.error("Temp logout failed:", e);
        }

        Cookies.remove("ava_cms_session");
        setLoading(false);
        return;
      }

      // CMS user
      const sessionData = {
        csrf: response.data.csrf,
        jwt: response.data.jwt,
        user: response.data.user,
      };

      Cookies.set("ava_cms_session", JSON.stringify(sessionData), {
        expires: 1 / 6, // 4 hours
        ...(!isDemo && { secure: true, sameSite: "Strict" }),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = "/dashboard";
    } catch (err: any) {
      const error =
        err?.response?.data?.error?.detail ||
        err?.response?.data?.error?.non_field_errors;

      message.error({
        content: `${error}`,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Flex vertical gap="large" align="center">
        <Flex gap="middle" justify="center" align="center">
          <AntDesignOutlined style={{ fontSize: 40, color: colorPrimary }} />
          <Title style={{ marginBottom: 0 }} level={3}>
            AVA
          </Title>
        </Flex>
        <Card style={{ padding: 18, width: 400 }}>
          <Flex vertical gap="large">
            <Flex vertical gap="small" align="center">
              <Title style={{ marginBottom: 0 }} level={3}>
                CMS
              </Title>
              <Text type="secondary">Login with your email account</Text>
            </Flex>
            <Form
              form={form}
              name="Login Form"
              initialValues={{ remember: true, ...(isDemo && DEMO_CREDENTIALS) }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password" },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="">Forgot password</a>
                </Flex>
              </Form.Item>

              {isDemo && (
                <Form.Item noStyle>
                  <Alert
                    message="Demo mode — credentials are pre-filled"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                </Form.Item>
              )}
              <Form.Item noStyle>
                <Button
                  loading={isLoading}
                  size="large"
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Flex>
        </Card>
        <Text type="secondary">Copyright © 2025. Cloudwalk Digital Inc. </Text>
      </Flex>
    </>
  );
};

export default LoginForm;
