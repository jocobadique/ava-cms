"use client";

import { loginService } from "@/services/auth";
import {
  AntDesignOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
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

const LoginForm = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    await loginService(values)
      .then(async (response) => {
        if (response.message === "Success") {
          const targetApp = response.data?.user?.target_apps?.[0];

          // Check if user has access to CMS
          if (targetApp === "cms") {
            const sessionData = {
              csrf: response.data.csrf, // CSRF token
              jwt: response.data.jwt, // JWT tokens
              user: response.data.user, // User details
            };

            // Set the session cookie (4 hours expiration)
            Cookies.set("ava_cms_session", JSON.stringify(sessionData), {
              expires: 1 / 6, // 4 hours = 1/6th of a day
              secure: true,
              sameSite: "Strict",
            });

            await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay
            window.location.href = "/dashboard"; // Force reload
          } else {
            message.error({
              content: "You don’t have access to the CMS application.",
            });
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        const error =
          err?.response?.data?.error?.detail ||
          err?.response?.data?.error?.non_field_errors;
        message.error({
          content: `${error}`,
        });
        setLoading(false);
      });
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
              initialValues={{ remember: true }}
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
