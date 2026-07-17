import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Table, Typography, Card, Button, Alert, Tabs, DatePicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getJobs, type Job } from '../api';
import { JobStatusBadge } from '../components/JobStatusBadge';
import '../App.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

export const JobList: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const fetchJobs = async (page: number, size: number, status: string, dates: [string, string] | null, sortF: string | null, sortD: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * size;
      const data = await getJobs(skip, size, status, dates?.[0], dates?.[1], sortF, sortD);
      setJobs(data.items);
      setTotalJobs(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, pageSize, activeTab, dateRange, sortBy, sortOrder);
  }, [currentPage, pageSize, activeTab, dateRange, sortBy, sortOrder]);

  const viewDetails = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const columns: ColumnsType<Job> = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortOrder: sortBy === 'id' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <JobStatusBadge status={status} />,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      sortOrder: sortBy === 'created_at' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => viewDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'queued', label: 'Queued' },
    { key: 'running', label: 'Running' },
    { key: 'succeeded', label: 'Succeeded' },
    { key: 'failed', label: 'Failed' },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.order) {
      setSortBy(sorter.columnKey);
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    } else {
      setSortBy(null);
      setSortOrder(null);
    }
  };

  return (
    <Layout className="layout" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', flexShrink: 0 }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Background Jobs Monitor
        </Title>
      </Header>
      
      <Content style={{ padding: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="site-layout-content" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {error ? (
            <Alert
              title="Error"
              description={error}
              type="error"
              showIcon
              action={
                <Button size="small" danger onClick={() => fetchJobs(currentPage, pageSize, activeTab)}>
                  Retry
                </Button>
              }
              style={{ marginBottom: 24, flexShrink: 0 }}
            />
          ) : null}

          <Card 
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            styles={{ body: { flex: 1, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' } }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              style={{ padding: '0 16px', flexShrink: 0 }}
              tabBarExtraContent={
                <RangePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(_, dateStrings) => {
                    const hasValue = dateStrings && dateStrings[0] && dateStrings[1];
                    setDateRange(hasValue ? [dateStrings[0], dateStrings[1]] : null);
                    setCurrentPage(1);
                    if (hasValue) {
                      setSortBy('created_at'); // Default sorter when time_range is selected
                      setSortOrder('desc');
                    } else {
                      setSortBy(null); // Reset to default initial sorter when time_range is cleared
                      setSortOrder(null);
                    }
                  }}
                />
              }
            />
            <Table
              columns={columns}
              dataSource={jobs}
              rowKey="id"
              loading={loading}
              onChange={handleTableChange}
              pagination={{ 
                current: currentPage,
                pageSize: pageSize,
                total: totalJobs,
                showSizeChanger: true,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                style: { padding: '0 16px', margin: '16px 0' } 
              }}
              scroll={{ x: 'max-content', y: 'calc(100vh - 330px)' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              onRow={(record) => ({
                onClick: () => viewDetails(record),
                style: { cursor: 'pointer' }
              })}
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};
