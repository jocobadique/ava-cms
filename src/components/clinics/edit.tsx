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
} from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClinicService } from "@/services/clinics";
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
    mutationFn: (values: any) => updateClinicService(values.id, { ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Clinic updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["clinic"] });
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
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
      title="Edit Clinic"
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
        <Row gutter={[16, 0]}>
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
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Contact Number"
              name="contact_number"
              rules={[
                {
                  required: true,
                  message: "Contact number is required",
                },
              ]}
            >
              <Input size="large" placeholder="Contact Number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Practice"
              name="practice"
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
              label="Approval Status"
              name="approval_status"
              rules={[
                {
                  required: true,
                  message: "Approval status is required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Approval Status"
                options={[
                  { value: "unknown", label: "Unknown" },
                  { value: "background_check", label: "Background Check" },
                  { value: "for_approval", label: "For Approval" },
                  { value: "approved", label: "Approved" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label="License Number" name="license_number">
              <Input size="large" placeholder="License number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
