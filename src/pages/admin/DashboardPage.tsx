import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Divider, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  ShoppingCartOutlined,
  DollarCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { ColumnsType } from 'antd/es/table';
import DateRangeFilter from '@/components/DateRangeFilter';
export interface StatusCount {
  _id: string;
  count: number;
}

export interface TimeSeries {
  cancelledOrders: number;
  cancelledAmount: number;
  totalOrders: number;
  date: string | null;
  revenue: number;
  profit: number;
}

export interface DashboardData {
  totalOrderCount: number;
  deliveredOrders: number;
  cancelledOrders: number;
  shippingOrders: number;
  totalRevenue: number;
  totalProfit: number;
  totalCancelledAmount: number;
  statusCounts: StatusCount[];
  timeSeries: TimeSeries[];
  topProducts: TopProduct[];
}
interface TopProduct {
  _id: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

// Hàm định dạng tiền tệ
const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return '0 ₫';
  return value.toLocaleString('vi-VN') + ' ₫';
};

const statusColors = {
  delivered: '#52c41a',
  shipping: '#faad14',
  cancelled: '#ff4d4f',
};

export default function ShopeeDashboard() {
  const [loading, setLoading] = useState(false);
  const today = dayjs();
  const last7 = dayjs().subtract(6, 'day');

  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([last7, today]);
  const [granularity, setGranularity] = useState('day');
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = async () => {
    setLoading(true);

    const start = range?.[0]?.format('YYYY-MM-DD');
    const end = range?.[1]?.format('YYYY-MM-DD');

    try {
      const res = await axios.get('http://localhost:8080/api/v1/admin/orders-report', {
        params: {
          startDate: start,
          endDate: end,
          granularity,
        },
      });

      setData(res.data?.data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [range, granularity]);

  if (!data && loading) return <Spin tip="Đang tải dữ liệu..." style={{ padding: 50 }} />;
  if (!data)
    return <div style={{ padding: 20 }}>Không có dữ liệu thống kê trong khoảng thời gian này.</div>;

  const totalOrders = data?.totalOrderCount || 0;
  const totalRevenue = data?.totalRevenue || 0;
  const totalProfit = data?.totalProfit || 0;
  const totalCancelledAmount = data?.totalCancelledAmount || 0;

  const deliveredOrders = data?.deliveredOrders || 0;
  const shippingOrders = data?.shippingOrders || 0;
  const cancelledOrders = data?.cancelledOrders || 0;

  const topProductColumns: ColumnsType<TopProduct> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      width: '40%',
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'totalQuantity',
      align: 'center',
      sorter: (a: TopProduct, b: TopProduct) => a.totalQuantity - b.totalQuantity,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      align: 'right',
      sorter: (a: TopProduct, b: TopProduct) => a.totalRevenue - b.totalRevenue,
      render: (v: number) => formatCurrency(v),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col>
            <strong>Thời gian:</strong>
          </Col>
          <Col>
            <DateRangeFilter value={range} onChange={setRange} />
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Card bordered={false} style={{ background: '#e6fffb' }}>
              <Statistic
                title="Tổng doanh thu (Đã hoàn thành)"
                value={totalRevenue}
                suffix="₫"
                valueStyle={{ color: '#0052d9', fontWeight: 'bold' }}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card bordered={false} style={{ background: '#f6ffed' }}>
              <Statistic
                title="Tổng lợi nhuận (Đã hoàn thành)"
                value={totalProfit}
                suffix="₫"
                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card bordered={false} style={{ background: '#fff7e6' }}>
              <Statistic
                title="Tổng đơn hàng"
                value={totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card bordered={false} style={{ background: '#fff1f0' }}>
              <Statistic
                title="Giá trị đơn hàng bị hủy"
                value={totalCancelledAmount}
                suffix="₫"
                valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider>Thống kê trạng thái đơn hàng</Divider>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Đơn hàng Hoàn thành"
                value={deliveredOrders}
                suffix={`(${((deliveredOrders / totalOrders) * 100 || 0)?.toFixed(1)}%)`}
                prefix={<DollarCircleOutlined style={{ color: statusColors.delivered }} />}
                valueStyle={{ color: statusColors.delivered }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Đơn hàng Đang giao"
                value={shippingOrders}
                suffix={`(${(shippingOrders / totalOrders) * 100 || 0?.toFixed(1)}%)`}
                prefix={<CarOutlined style={{ color: statusColors.shipping }} />}
                valueStyle={{ color: statusColors.shipping }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card bordered={false} hoverable>
              <Statistic
                title="Đơn hàng Bị hủy"
                value={cancelledOrders}
                suffix={`(${((cancelledOrders / totalOrders) * 100 || 0)?.toFixed(1)}%)`}
                prefix={<CloseCircleOutlined style={{ color: statusColors.cancelled }} />}
                valueStyle={{ color: statusColors.cancelled }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Card title="Phân tích Doanh thu, Lợi nhuận và Đơn hủy" style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.timeSeries || []}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={['auto', 'auto']} tickFormatter={formatCurrency} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ff4d4f" />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(label: string) => `Thời gian: ${label}`}
                  />
                  <Legend />

                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#0052d9"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="profit"
                    name="Lợi nhuận"
                    stroke="#52c41a"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cancelledOrders"
                    name="Số đơn bị hủy"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Divider>Top sản phẩm bán chạy</Divider>

        <Card>
          <Table
            rowKey="_id"
            dataSource={data?.topProducts || []}
            pagination={{ pageSize: 5 }}
            columns={topProductColumns}
          />
        </Card>
      </Spin>
    </div>
  );
}
