"use client";

import { App, Button, Form, Input, Modal, Row, Col, Divider } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDrugService } from "@/services/drug";
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
    mutationFn: (values: any) => createDrugService({ ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Drug created successfully." });
      queryClient.invalidateQueries({ queryKey: ["drug"] });
      queryClient.invalidateQueries({ queryKey: ["drugs"] });

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
      title="Create Drug"
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
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Generic name"
              name="generic_name"
              rules={[
                {
                  required: true,
                  message: "Generic name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Generic name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Brand name"
              name="brand_name"
              rules={[
                {
                  required: true,
                  message: "Brand name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Brand name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Dosage"
              name="dosage"
              rules={[
                {
                  required: true,
                  message: "Dosage is required",
                },
              ]}
            >
              <Input size="large" placeholder="Dosage" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
