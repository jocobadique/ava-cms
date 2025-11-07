"use client";

import { App, Button, Form, Input, Modal, Row, Col, Divider } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createClinicBranchService } from "@/services/branches";
import { getClinicService } from "@/services/clinics";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";

interface AddProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddModal({ isOpen, onClose }: AddProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const clinicId = params.clinicId;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  const { data: clinicData } = useQuery({
    queryKey: ["clinic", clinicId],
    queryFn: () => getClinicService(clinicId),
    enabled: !!clinicId, // Avoid fetching if clinicId is not available
  });

  const clinic_name = clinicData?.name;

  // Define update mutation using useMutation
  const addMutation = useMutation({
    mutationFn: (values: any) =>
      createClinicBranchService(clinicId, { ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Branch created successfully." });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
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
      title="Add Branch"
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
              initialValue={clinic_name}
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
