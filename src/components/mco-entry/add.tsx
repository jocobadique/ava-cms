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
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createMcoEntryService } from "@/services/mco-entry";
import { getClinicService } from "@/services/clinics";
import { handleFormErrorsMcoEntry } from "@/utilities/helpers/handleFormErrorsMcoEntry";

const { Title } = Typography;
const { TextArea } = Input;

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

  // Define update mutation using useMutation
  const addMutation = useMutation({
    mutationFn: (values: any) => createMcoEntryService(clinicId, { ...values }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrorsMcoEntry(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "MCO entry created successfully." });
      queryClient.invalidateQueries({ queryKey: ["mco-entry"] });
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
      title="Add MCO entry"
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
        initialValues={{
          contacts: [{ label: "", phone: "" }],
        }}
        clearOnDestroy
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Code is required",
                },
              ]}
            >
              <Input size="large" placeholder="Code" />
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
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label="Kind"
              name="kind"
              rules={[
                {
                  required: true,
                  message: "Kind is required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Kind"
                options={[
                  { value: "unknown", label: "Unknown" },
                  { value: "hmo", label: "HMO" },
                  { value: "insurance", label: "Insurance" },
                  { value: "prepaid", label: "Prepaid" },
                ]}
              />
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
        <Divider orientation="left" plain orientationMargin={0}>
          <Title level={5}>Contact Number</Title>
        </Divider>
        <Form.List name="contacts">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[16, 0]} key={key} align="middle">
                  <Col
                    xs={index === 0 ? 24 : 12}
                    sm={index === 0 ? 24 : 12}
                    md={index === 0 ? 24 : 12}
                    lg={12}
                    xl={12}
                    xxl={12}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "label"]}
                      label="Label"
                      rules={[{ required: true, message: "Label is required" }]}
                    >
                      <Input size="large" placeholder="Label " />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={index === 0 ? 24 : 10}
                    sm={index === 0 ? 24 : 10}
                    md={index === 0 ? 24 : 10}
                    lg={index === 0 ? 12 : 10}
                    xl={index === 0 ? 12 : 10}
                    xxl={index === 0 ? 12 : 10}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "phone"]}
                      label="Phone"
                      rules={[{ required: true, message: "Phone is required" }]}
                    >
                      <Input size="large" placeholder="Phone Number" />
                    </Form.Item>
                  </Col>
                  {index !== 0 && (
                    <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
                      <Button
                        danger
                        size="large"
                        type="text"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      />
                    </Col>
                  )}
                </Row>
              ))}
              <Form.Item>
                <Button
                  color="primary"
                  variant="dashed"
                  size="large"
                  onClick={() => add({ label: "", phone: "" })}
                  icon={<PlusOutlined />}
                >
                  Add Contact
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
      </Form>
    </Modal>
  );
}
