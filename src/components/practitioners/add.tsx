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
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClinicService } from "@/services/clinics";
import { useParams } from "next/navigation";
import { getClinicBranchesService } from "@/services/branches";
import { createClinicPractitionersService } from "@/services/practitioners";
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

  const { data: branchesData } = useQuery({
    queryKey: ["branches", clinicId],
    queryFn: () => getClinicBranchesService(clinicId),
    enabled: !!clinicId, // Avoid fetching if clinicId is not available
  });

  const clinic_name = clinicData?.name;

  // Define update mutation using useMutation
  const addMutation = useMutation({
    mutationFn: (values: any) =>
      createClinicPractitionersService({ ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Practitioner created successfully." });
      queryClient.invalidateQueries({ queryKey: ["practitioner"] });
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
      title="Add Practitioner"
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
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="First Name"
              name={["account", "first_name"]}
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
              name={["account", "last_name"]}
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
            <Form.Item label="Middle Name" name={["account", "middle_name"]}>
              <Input size="large" placeholder="Middle name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Email"
              name={["account", "email"]}
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
              label="License Number"
              name="license_number"
              rules={[
                {
                  required: true,
                  message: "License number is required",
                },
              ]}
            >
              <Input size="large" placeholder="License number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              initialValue={clinic_name}
              label="Clinic"
              name="name"
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
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Password"
              name={["account", "password"]}
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
              name={["account", "password_confirm"]}
              rules={[
                {
                  required: true,
                  message: "Password confirm is required",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue(["account", "password"]) === value
                    ) {
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
        </Row>
      </Form>
    </Modal>
  );
}
