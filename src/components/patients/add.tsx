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
  Typography,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getClinicBranchesService } from "@/services/branches";
import { createClinicPatientService } from "@/services/patients";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";

const { Text } = Typography;

interface AddProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranchId?: string | null;
}

export default function AddModal({
  isOpen,
  onClose,
  selectedBranchId,
}: AddProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const clinicId = params.clinicId;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedBranchId) {
      form.setFieldsValue({ branch_id: selectedBranchId });
    } else if (isOpen && !selectedBranchId) {
      form.setFieldsValue({ branch_id: undefined });
    }
  }, [isOpen, selectedBranchId, form]);

  const { data: branchesData, isLoading: isBranchesDataLoading } = useQuery({
    queryKey: ["branches", clinicId],
    queryFn: () => getClinicBranchesService(clinicId),
    enabled: !!clinicId, // Avoid fetching if clinicId is not available
  });

  // Define update mutation using useMutation
  const addMutation = useMutation({
    mutationFn: (values: any) => createClinicPatientService({ ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Patient created successfully." });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["clinic-users"] });
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
      title="Add Patient"
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
        <Form.Item name="clinic_id" initialValue={clinicId} hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="clinic_role" initialValue="patient" hidden>
          <Input type="hidden" />
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
              label="Branch"
              name="branch_id"
              rules={[
                {
                  required: true,
                  message: "Branch is required",
                },
              ]}
            >
              <Select
                loading={isBranchesDataLoading}
                size="large"
                placeholder="Select Branch"
                options={
                  branchesData?.map((branch: any) => ({
                    value: branch.id,
                    label: branch.name,
                  })) || []
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item>
              <Text type="secondary">
                <strong>Note:</strong> Be sure to enter a valid email address.{" "}
                <br /> A password reset email will be sent to the patient after
                email verification.
              </Text>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
