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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateClinicAdminService } from "@/services/clinic-admins";
import { getClinicBranchesService } from "@/services/branches";
import { useParams } from "next/navigation";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";

interface EditProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditModal({ data, isOpen, onClose }: EditProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const clinicId = params.clinicId;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const { data: branchesData } = useQuery({
    queryKey: ["branches", clinicId],
    queryFn: () => getClinicBranchesService(clinicId),
    enabled: !!clinicId, // Avoid fetching if clinicId is not available
  });

  // Define update mutation using useMutation
  const updateMutation = useMutation({
    mutationFn: (values: any) =>
      updateClinicAdminService(values.id, { ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Clinic admin updated successfully." });

      queryClient.invalidateQueries({ queryKey: ["clinic-admins"] });
      queryClient.invalidateQueries({ queryKey: ["clinic-users"] });
      onClose();
    },
    onSettled: async () => {
      setLoading(false);
    },
  });

  // Set initial form values when modal opens or data changes

  useEffect(() => {
    if (isOpen && data) {
      const initialValues = { ...data };

      if (!data.branch_id && branchesData?.length > 0) {
        initialValues.branch_id = branchesData[0].id;
      }

      form.setFieldsValue(initialValues);
    }
  }, [isOpen, data, branchesData, form]);

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
      title="Edit Clinic Admin"
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
              label="Display Name"
              name="display_name"
              rules={[
                {
                  required: true,
                  message: "Display name is required",
                },
              ]}
            >
              <Input size="large" placeholder="Display Name" />
            </Form.Item>
          </Col>
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
              label="Clinic Role"
              name="clinic_role"
              rules={[
                {
                  required: true,
                  message: "Clinic role  is required",
                },
              ]}
            >
              <Select
                disabled
                size="large"
                placeholder="Select Clinic Role"
                options={[
                  { value: "clinic_admin", label: "Clinic Admin" },
                  { value: "branch_admin", label: "Branch Admin" },
                  { value: "staff", label: "Staff" },
                ]}
              />
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
                disabled
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
        </Row>
      </Form>
    </Modal>
  );
}
