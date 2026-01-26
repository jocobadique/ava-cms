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
  Typography,
  DatePicker,
} from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createPatientMcoService } from "@/services/mco-patient";
import { getMcosService } from "@/services/mco";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";

const { TextArea } = Input;

interface AddProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddModal({ isOpen, onClose }: AddProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const patientId = params.patientId;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  const { data: mcosData, isLoading: isMcosDataLoading } = useQuery({
    queryKey: ["mcos"],
    queryFn: getMcosService,
  });

  // Define update mutation using useMutation
  const addMutation = useMutation({
    mutationFn: (values: any) =>
      createPatientMcoService(patientId, {
        ...values,
        valid_until: values.valid_until.format("YYYY-MM-DD"),
      }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Patient mco created successfully." });
      queryClient.invalidateQueries({ queryKey: ["mco-patients"] });
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
      title="Add patient mco"
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
              label="Healthcare provider"
              name={["mco", "id"]}
              rules={[
                {
                  required: true,
                  message: "Healthcare provider is required",
                },
              ]}
            >
              <Select
                loading={isMcosDataLoading}
                size="large"
                placeholder="Select Healthcare provider"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  mcosData?.map((mco: any) => ({
                    value: mco.id,
                    label: mco.name,
                  })) || []
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="MCO number"
              name="mco_number"
              rules={[
                {
                  required: true,
                  message: "Mco number is required",
                },
              ]}
            >
              <Input size="large" placeholder="Mco number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Plan"
              name="plan"
              rules={[
                {
                  required: true,
                  message: "Plan is required",
                },
              ]}
            >
              <Input size="large" placeholder="Plan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Valid until"
              name="valid_until"
              rules={[
                {
                  required: true,
                  message: "Valid until is required",
                },
              ]}
            >
              <DatePicker style={{ display: "block" }} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
              label="Notes"
              name="notes"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <TextArea rows={4} placeholder="Notes" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
