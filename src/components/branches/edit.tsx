"use client";

import { App, Button, Form, Input, Modal, Row, Col, Divider } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClinicBranchService } from "@/services/branches";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";

interface EditProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditModal({ data, isOpen, onClose }: EditProps) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Define update mutation using useMutation
  const updateMutation = useMutation({
    mutationFn: (values: any) =>
      updateClinicBranchService(values.clinic_id, values.id, { ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Branch updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      onClose();
    },
    onSettled: async () => {
      setLoading(false);
    },
  });

  // Set initial form values when modal opens or data changes
  useEffect(() => {
    if (isOpen && data) {
      form.setFieldsValue(data);
    }
  }, [isOpen, data, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      updateMutation.mutate(values); // Trigger mutation
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Modal
      title="Edit Branch"
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
          disabled={!isFormChanged || isLoading}
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
        onValuesChange={() => {
          setIsFormChanged(true);
        }}
        clearOnDestroy
      >
        <Form.Item name="id" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="clinic_id" hidden>
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Clinic"
              name="clinic_name"
              rules={[
                {
                  required: true,
                  message: "Clinic is required",
                },
              ]}
            >
              <Input disabled size="large" placeholder="Clinic" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Address is required",
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Address" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
