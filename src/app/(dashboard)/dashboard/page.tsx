"use client";

import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Layout,
  Progress,
  Row,
  Statistic,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { CalendarFilled, InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getGeneralsService,
  getBasicStatsService,
} from "@/services/business-intelligence";
import { getClinicsService } from "@/services/clinics";

const { Content } = Layout;
const { Text } = Typography;

// Static monthly trend data (demo — no real historical data exists)
const MONTHLY_SUBSCRIPTIONS = [
  { month: "Jan", value: 18 }, { month: "Feb", value: 20 }, { month: "Mar", value: 21 },
  { month: "Apr", value: 22 }, { month: "May", value: 20 }, { month: "Jun", value: 23 },
  { month: "Jul", value: 25 }, { month: "Aug", value: 26 }, { month: "Sep", value: 24 },
  { month: "Oct", value: 27 }, { month: "Nov", value: 26 }, { month: "Dec", value: 28 },
];

const MONTHLY_USERS = [
  { month: "Jan", value: 620 }, { month: "Feb", value: 680 }, { month: "Mar", value: 720 },
  { month: "Apr", value: 760 }, { month: "May", value: 740 }, { month: "Jun", value: 800 },
  { month: "Jul", value: 840 }, { month: "Aug", value: 880 }, { month: "Sep", value: 860 },
  { month: "Oct", value: 920 }, { month: "Nov", value: 910 }, { month: "Dec", value: 956 },
];

const SP_USERS = MONTHLY_USERS.map((d) => ({ v: d.value }));
const SP_SUBS = MONTHLY_SUBSCRIPTIONS.map((d) => ({ v: d.value }));

type Period = "today" | "week" | "month" | "year";
const PERIOD_SLICE: Record<Period, number> = { today: 1, week: 3, month: 6, year: 12 };

function sliceByPeriod<T>(data: T[], period: Period): T[] {
  return data.slice(-PERIOD_SLICE[period]);
}

function flattenClinicRanking(stats: any): { name: string; total_users: number }[] {
  if (!stats) return [];
  const all: { name: string; total_users: number }[] = [];
  for (const plan of ["basic", "pro", "biz", "prime"] as const) {
    const planData = stats[plan];
    if (!Array.isArray(planData)) continue;
    const clinicsTuple = planData.find((e: any) => Array.isArray(e) && e[0] === "clinics");
    if (!Array.isArray(clinicsTuple?.[1])) continue;
    for (const c of clinicsTuple[1]) {
      all.push({ name: c.name, total_users: c.total_users });
    }
  }
  return all.sort((a, b) => b.total_users - a.total_users);
}

function Sparkline({
  data,
  color,
  gid,
}: {
  data: { v: number }[];
  color: string;
  gid: string;
}) {
  return (
    <div style={{ width: 130, height: 60, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="v" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            fill={`url(#${gid})`}
            dot={false}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MiniBar({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <div style={{ width: 130, height: 60, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <XAxis dataKey="v" hide />
          <YAxis hide domain={[0, "auto"]} />
          <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardPage() {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [activeTab, setActiveTab] = useState<"subscriptions" | "users">(
    "subscriptions"
  );
  const [period, setPeriod] = useState<Period>("year");

  const { data: generals, isLoading: loadingGenerals } = useQuery({
    queryKey: ["bi-generals"],
    queryFn: getGeneralsService,
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["bi-stats"],
    queryFn: getBasicStatsService,
  });

  const { data: clinics, isLoading: loadingClinics } = useQuery({
    queryKey: ["clinics"],
    queryFn: getClinicsService,
  });

  const activeClinics = clinics?.filter((c: any) => c.is_active).length ?? 0;
  const totalClinics = clinics?.length ?? 0;
  const activeRate =
    totalClinics > 0 ? Math.round((activeClinics / totalClinics) * 100) : 0;

  const clinicRanking = flattenClinicRanking(stats);

  const chartData = sliceByPeriod(
    activeTab === "subscriptions" ? MONTHLY_SUBSCRIPTIONS : MONTHLY_USERS,
    period
  );

  const PERIODS: { label: string; key: Period }[] = [
    { label: "Today", key: "today" },
    { label: "This Week", key: "week" },
    { label: "This Month", key: "month" },
    { label: "This Year", key: "year" },
  ];

  return (
    <>
      <Flex
        wrap
        gap="small"
        style={{ margin: "88px 16px 0px 16px" }}
        align="center"
        justify="space-between"
      >
        <Breadcrumb
          items={[{ title: <Link href="/dashboard">Dashboard</Link> }]}
        />
        <Text type="secondary">
          <CalendarFilled style={{ marginRight: 6 }} />
          {new Date().toLocaleString("en-US", {
            timeZone: "UTC",
            dateStyle: "full",
          })}
        </Text>
      </Flex>

      <Content style={{ margin: "24px 16px" }}>
        {/* ── Stat Cards ── */}
        <Row gutter={[16, 16]}>
          {/* Card 1: Total Clinics */}
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loadingClinics || loadingGenerals} style={{ height: "100%" }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Total Clinics</Text>
                <Tooltip title="Total registered clinics on the platform">
                  <InfoCircleOutlined style={{ color: "#bfbfbf", cursor: "pointer" }} />
                </Tooltip>
              </Flex>
              <Statistic
                value={generals?.extra?.total_clinics ?? 0}
                valueStyle={{ fontSize: 34, fontWeight: 700 }}
              />
              <Flex gap={16} style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Week <span style={{ color: "#52c41a" }}>10% ▲</span>
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Day <span style={{ color: "#52c41a" }}>2% ▲</span>
                </Text>
              </Flex>
              <Text
                type="secondary"
                style={{ fontSize: 12, marginTop: 8, display: "block" }}
              >
                Active: {activeClinics} of {totalClinics} clinics
              </Text>
            </Card>
          </Col>

          {/* Card 2: Total Users */}
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loadingGenerals} style={{ height: "100%" }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Total Users</Text>
                <Tooltip title="Total active users across all clinics">
                  <InfoCircleOutlined style={{ color: "#bfbfbf", cursor: "pointer" }} />
                </Tooltip>
              </Flex>
              <Flex justify="space-between" align="flex-end">
                <div>
                  <Statistic
                    value={generals?.extra?.total_clinic_users ?? 0}
                    valueStyle={{ fontSize: 34, fontWeight: 700 }}
                  />
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, marginTop: 8, display: "block" }}
                  >
                    Avg ~78 / month
                  </Text>
                </div>
                <Sparkline data={SP_USERS} color="#a855f7" gid="spkUsers" />
              </Flex>
            </Card>
          </Col>

          {/* Card 3: Subscriptions */}
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loadingGenerals} style={{ height: "100%" }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Subscriptions</Text>
                <Tooltip title="Total active subscription plans">
                  <InfoCircleOutlined style={{ color: "#bfbfbf", cursor: "pointer" }} />
                </Tooltip>
              </Flex>
              <Flex justify="space-between" align="flex-end">
                <div>
                  <Statistic
                    value={generals?.extra?.total_subscriptions ?? 0}
                    valueStyle={{ fontSize: 34, fontWeight: 700 }}
                  />
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, marginTop: 8, display: "block" }}
                  >
                    Avg 34 users / plan
                  </Text>
                </div>
                <MiniBar data={SP_SUBS} color={colorPrimary} />
              </Flex>
            </Card>
          </Col>

          {/* Card 4: Clinic Active Rate */}
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loadingClinics} style={{ height: "100%" }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Clinic Active Rate</Text>
                <Tooltip title="Percentage of clinics currently active">
                  <InfoCircleOutlined style={{ color: "#bfbfbf", cursor: "pointer" }} />
                </Tooltip>
              </Flex>
              <Statistic
                value={activeRate}
                suffix="%"
                valueStyle={{ fontSize: 34, fontWeight: 700 }}
              />
              <Progress
                percent={activeRate}
                showInfo={false}
                strokeColor={{ "0%": colorPrimary, "100%": "#52c41a" }}
                style={{ marginTop: 12, marginBottom: 4 }}
              />
              <Flex gap={16} style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Week <span style={{ color: "#52c41a" }}>2% ▲</span>
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Day <span style={{ color: "#ff4d4f" }}>1% ▼</span>
                </Text>
              </Flex>
            </Card>
          </Col>
        </Row>

        {/* ── Main Chart + Ranking ── */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card>
              {/* Header row: tab switcher + period filter */}
              <Flex
                wrap
                justify="space-between"
                align="center"
                gap="middle"
                style={{ marginBottom: 24 }}
              >
                <Flex gap={32}>
                  {(["subscriptions", "users"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "0 0 8px 0",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: activeTab === tab ? 600 : 400,
                        color: activeTab === tab ? colorPrimary : "#8c8c8c",
                        borderBottom:
                          activeTab === tab
                            ? `2px solid ${colorPrimary}`
                            : "2px solid transparent",
                        textTransform: "capitalize",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </Flex>
                <Flex gap={4} wrap>
                  {PERIODS.map(({ label, key }) => (
                    <Button
                      key={key}
                      size="small"
                      type={period === key ? "primary" : "text"}
                      onClick={() => setPeriod(key)}
                    >
                      {label}
                    </Button>
                  ))}
                </Flex>
              </Flex>

              <Row gutter={[32, 24]}>
                {/* Bar chart */}
                <Col xs={24} lg={17}>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 8, bottom: 5, left: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f0f0f0"
                        />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#8c8c8c" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#8c8c8c" }}
                          width={40}
                        />
                        <RTooltip
                          cursor={{ fill: "rgba(0,0,0,0.04)" }}
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name={
                            activeTab === "subscriptions"
                              ? "Subscriptions"
                              : "Users"
                          }
                          fill={colorPrimary}
                          radius={[4, 4, 0, 0]}
                          maxBarSize={44}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>

                {/* Clinic ranking */}
                <Col xs={24} lg={7}>
                  <Text
                    strong
                    style={{ display: "block", marginBottom: 16, fontSize: 14 }}
                  >
                    Clinic Rankings by Users
                  </Text>
                  {loadingStats ? null : (
                    <Flex vertical gap={14}>
                      {clinicRanking.map((clinic, idx) => (
                        <Flex key={clinic.name} align="center" gap={12}>
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: idx < 3 ? colorPrimary : "#f5f5f5",
                              color: idx < 3 ? "#fff" : "#8c8c8c",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <Text
                            style={{
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: 13,
                            }}
                          >
                            {clinic.name}
                          </Text>
                          <Text strong style={{ flexShrink: 0, fontSize: 13 }}>
                            {clinic.total_users.toLocaleString()}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </>
  );
}
