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
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMcoEntryService } from "@/services/mco-entry";
import { handleFormErrorsMcoEntry } from "@/utilities/helpers/handleFormErrorsMcoEntry";

const { Title } = Typography;
const { TextArea } = Input;

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
      updateMcoEntryService(values.requesting_clinic?.id, values.id, {
        ...values,
      }),
    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrorsMcoEntry(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "MCO entry updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["mco-entry"] });
      onClose();
    },
    onSettled: async () => {
      setLoading(false);
    },
  });

  // Set initial form values when modal opens or data changes
  useEffect(() => {
    if (isOpen && data) {
      form.setFieldsValue({
        ...data,
        status: data?.status === "new" ? undefined : data?.status,
      });
    }
  }, [isOpen, data, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      updateMutation.mutate({
        ...values,
        status: values.status ?? data?.status,
      }); // Trigger mutation
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Modal
      title="Edit MCO entry"
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
        <Form.Item name={["requesting_clinic", "id"]} hidden>
          <Input type="hidden" />
        </Form.Item>
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
          <Divider orientation="left" plain orientationMargin={0}>
            <Title level={5}>Status</Title>
          </Divider>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
              name="status"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select status"
                options={[
                  { value: "approved", label: "Approve" },
                  { value: "declined", label: "Decline" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Conditionally render decline_reason */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.status !== curr.status}
          >
            {({ getFieldValue }) =>
              getFieldValue("status") === "declined" ? (
                <Col span={24}>
                  <Form.Item
                    label="Decline reason"
                    name="decline_reason"
                    rules={[
                      { required: true, message: "Decline reason is required" },
                    ]}
                  >
                    <TextArea rows={4} placeholder="Enter reason for decline" />
                  </Form.Item>
                </Col>
              ) : null
            }
          </Form.Item>
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
