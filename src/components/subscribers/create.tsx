"use client";

import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Divider,
  Select,
  Checkbox,
} from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubscriberService } from "@/services/subscribers";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";

interface AddProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: AddProps) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  // Define update mutation using useMutation
  const addMutation = useMutation({
    mutationFn: (values: any) => createSubscriberService({ ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Subscriber created successfully." });
      queryClient.invalidateQueries({ queryKey: ["subscriber"] });
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["clinic"] });
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      onClose();
    },
    onSettled: async () => {
      setLoading(false);
    },
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      addMutation.mutate(values); // Trigger mutation
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Modal
      title="Create Subscriber"
      centered
      mask={false}
      open={isOpen}
      onCancel={onClose}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={[
        <Button size="large" key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          size="large"
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleOk}
        >
          Save
        </Button>,
      ]}
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        clearOnDestroy
      >
        <Form.Item initialValue={true} hidden name="accept_saas_agreement">
          <Input hidden />
        </Form.Item>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "First name is required",
                },
              ]}
            >
              <Input size="large" placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Last name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Last name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label="Middle Name" name="middle_name">
              <Input size="large" placeholder="Middle name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                  type: "email",
                },
              ]}
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Clinic Name"
              name="clinic_name"
              rules={[
                {
                  required: true,
                  message: "Clinic name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Clinic name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Practice"
              name="clinic_practice"
              rules={[
                {
                  required: true,
                  message: "Practice is required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Practice"
                options={[
                  { value: "unknown", label: "Unknown" },
                  { value: "dental", label: "Dental" },
                  { value: "ophthal", label: "Opthal" },
                  { value: "pedia", label: "Pedia" },
                  { value: "ent", label: "ENT" },
                  { value: "internal", label: "Internal" },
                  { value: "derma", label: "Derma" },
                  { value: "obgyn", label: "Obgyn" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Main Branch Address"
              name="main_branch_address"
              rules={[
                {
                  required: true,
                  message: "Main branch address is required",
                },
              ]}
            >
              <Input size="large" placeholder="Main Branch Address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Contact Number"
              name="clinic_contactnum"
              rules={[
                {
                  required: true,
                  message: "Contact number is required",
                },
              ]}
            >
              <Input size="large" placeholder="Contact number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Subscription"
              name="subscription"
              rules={[
                {
                  required: true,
                  message: "Subscription  is required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Subscription"
                options={[
                  { value: "unknown", label: "Unknown" },
                  { value: "basic", label: "Basic" },
                  { value: "pro", label: "Pro" },
                  { value: "biz", label: "Biz" },
                  { value: "prime", label: "Prime" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Payment Term"
              name="payment_term"
              rules={[
                {
                  required: true,
                  message: "Payment term  is required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Payment Term"
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "annually", label: "Annually" },
                  { value: "semi_annual", label: "Semi Annual" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input.Password size="large" placeholder="Password" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Password confirm"
              name="password_confirm"
              rules={[
                {
                  required: true,
                  message: "Password confirm is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Password Confirm" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              name="is_practitioner"
              valuePropName="checked"
              initialValue={false}
              rules={[{ required: false }]}
            >
              <Checkbox>Is the subscriber a practitioner?</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
