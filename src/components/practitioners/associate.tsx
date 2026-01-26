"use client";

import {
  deleteClinicPractitionerAssociateService,
  updateClinicPractitionerAssociateService,
} from "@/services/practitioners";
import {
  App,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Divider,
  Select,
  Typography,
  Table,
  TableProps,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleFormErrors } from "@/utilities/helpers/handleFormErrors";
import { getClinicsService } from "@/services/clinics";
import { getClinicBranchesService } from "@/services/branches";
import { CircleMinus } from "lucide-react";

const { Title, Text } = Typography;

interface EditProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssociateModal({ data, isOpen, onClose }: EditProps) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [associateTable, setAssociateTable] = useState([]);

  const { data: clinicsData, isLoading: clinicDataLoading } = useQuery({
    queryKey: ["clinics"],
    queryFn: getClinicsService,
  });

  const { data: branchesData, isLoading: branchesDataLoading } = useQuery({
    queryKey: ["branches", selectedClinicId],
    queryFn: () =>
      selectedClinicId
        ? getClinicBranchesService(selectedClinicId)
        : Promise.resolve([]),
    enabled: !!selectedClinicId, // Prevent execution if clinicId is null
  });

  // Define update mutation using useMutation
  const updateMutation = useMutation({
    mutationFn: (values: any) =>
      updateClinicPractitionerAssociateService(data.id, values?.branch_id, {}),

    onMutate: async () => {
      setLoading(true);
    },
    onError: async (error: any) => {
      handleFormErrors(error, form, message);
    },
    onSuccess: async () => {
      message.success({ content: "Practitioner associated successfully." });

      updateClinicPractitionerAssociateService(
        data.id,
        data?.branch_id,
        {}
      ).then((response) => {
        setAssociateTable(response?.data?.branches);
      });
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["practitioner"] });
      queryClient.invalidateQueries({ queryKey: ["practitioners"] });
      setLoading(false);
      handleClear();
    },
  });

  useEffect(() => {
    if (isOpen) {
      updateClinicPractitionerAssociateService(
        data.id,
        data?.branch_id,
        {}
      ).then((response) => {
        setAssociateTable(response?.data?.branches);
      });
    }
  }, [isOpen]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      updateMutation.mutate(values); // Trigger mutation
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleClinicChange = (value: string) => {
    if (value !== selectedClinicId) {
      setSelectedClinicId(value);

      // Avoid triggering unnecessary state updates
      const currentBranchId = form.getFieldValue("branch_id");
      if (currentBranchId) {
        form.setFieldsValue({ branch_id: null });
      }
    }
  };

  const handleClear = () => {
    form.resetFields(["clinic_id", "branch_id"]);
    setSelectedClinicId(null);
    setIsFormChanged(false);
  };

  const deleteMutation = useMutation({
    mutationFn: ({
      practitionerId,
      branchId,
    }: {
      practitionerId: any;
      branchId: any;
    }) => deleteClinicPractitionerAssociateService(practitionerId, branchId),
  });

  const handleDeleteAssociate = (row: any) => {
    const practitionerId = data?.id;
    const defaultBranchId = data?.branch_id;
    const branchId = row.id;
    deleteMutation.mutate(
      { practitionerId, branchId },
      {
        onSuccess: () => {
          message.success("Practitioner removed successfully.");
        },

        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.error?.non_field_errors ||
            "Failed to remove practitioner";
          message.error({ content: errorMessage });
        },

        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["practitioner"] });
          queryClient.invalidateQueries({ queryKey: ["practitioners"] });

          updateClinicPractitionerAssociateService(
            practitionerId,
            defaultBranchId,
            {}
          ).then((response) => {
            setAssociateTable(response?.data?.branches);
          });
        },
      }
    );
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "Clinic",
      dataIndex: "clinic_name",
      key: "clinic_name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Branch",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, row) => {
        if (row?.clinic_id === data?.clinic_id && row?.id === data?.branch_id) {
          return <Text type="secondary">Default</Text>;
        }

        return (
          <Button
            danger
            size="large"
            type="text"
            icon={<CircleMinus size={18} />}
            onClick={() => handleDeleteAssociate(row)}
          />
        );
      },
      align: "center",
    },
  ];

  return (
    <Modal
      title="Associate Practitioner"
      centered
      mask={false}
      open={isOpen}
      onCancel={onClose}
      width={{
        xs: "90%",
        sm: "80%",
        md: "80%",
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
          Associate
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
        <Title level={4}>{data?.account?.display_name}</Title>

        <Row gutter={[16, 0]} align="middle" justify="space-between">
          <Col
            xs={{ flex: "100%" }}
            sm={{ flex: "100%" }}
            md={{ flex: "auto" }}
            lg={{ flex: "auto" }}
            xl={{ flex: "auto" }}
            xxl={{ flex: "auto" }}
          >
            <Form.Item
              label="Clinic"
              name="clinic_id"
              rules={[
                {
                  required: true,
                  message: "Clinic is required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Clinic"
                loading={clinicDataLoading}
                disabled={clinicDataLoading}
                onChange={handleClinicChange}
                optionFilterProp="label"
                showSearch
                options={
                  clinicsData?.map((clinic: any) => ({
                    value: clinic.id,
                    label: clinic.name,
                  })) || []
                }
              />
            </Form.Item>
          </Col>
          <Col
            xs={{ flex: "100%" }}
            sm={{ flex: "100%" }}
            md={{ flex: "auto" }}
            lg={{ flex: "auto" }}
            xl={{ flex: "auto" }}
            xxl={{ flex: "auto" }}
          >
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
                loading={branchesDataLoading}
                disabled={!selectedClinicId}
                optionFilterProp="label"
                showSearch
                options={
                  branchesData?.map((branch: any) => ({
                    value: branch.id,
                    label: branch.name,
                  })) || []
                }
              />
            </Form.Item>
          </Col>

          <Col
            xs={{ flex: "100%" }}
            sm={{ flex: "100%" }}
            md={{ flex: "none" }}
            lg={{ flex: "none" }}
            xl={{ flex: "none" }}
            xxl={{ flex: "none" }}
          >
            <Button
              type="primary"
              ghost
              icon={<ReloadOutlined size={16} />}
              style={{ marginTop: 5 }}
              block
              size="large"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        dataSource={associateTable}
        loading={
          !associateTable.length ||
          deleteMutation.isPending ||
          updateMutation.isPending
        }
        columns={columns}
        pagination={{
          pageSize: 3,
          total: associateTable ? associateTable.length : 0,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </Modal>
  );
}
