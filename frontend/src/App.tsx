import React, { useEffect, useState } from 'react';
import { Layout, Table, Typography, Card, Button, Alert, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getJobs, type Job } from './api';
import { JobStatusBadge } from './components/JobStatusBadge';
import { JobDetailDrawer } from './components/JobDetailDrawer';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs(0, 100);
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openDrawer = (job: Job) => {
    setSelectedJob(job);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedJob(null);
  };

  const columns: ColumnsType<Job> = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
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
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => openDrawer(record)}>
          View Details
        </Button>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredJobs = jobs.filter(job => 
    activeTab === 'all' ? true : job.status.toLowerCase() === activeTab
  );

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'queued', label: 'Queued' },
    { key: 'running', label: 'Running' },
    { key: 'succeeded', label: 'Succeeded' },
    { key: 'failed', label: 'Failed' },
  ];

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
                <Button size="small" danger onClick={fetchJobs}>
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
              onChange={setActiveTab}
              items={tabItems}
              style={{ padding: '0 16px', flexShrink: 0 }}
            />
            <Table
              columns={columns}
              dataSource={filteredJobs}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10, style: { padding: '0 16px', margin: '16px 0' } }}
              scroll={{ x: 'max-content', y: 'calc(100vh - 330px)' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              onRow={(record) => ({
                onClick: () => openDrawer(record),
                style: { cursor: 'pointer' }
              })}
            />
          </Card>
        </div>
      </Content>

      <JobDetailDrawer
        job={selectedJob}
        visible={drawerVisible}
        onClose={closeDrawer}
      />
    </Layout>
  );
};

export default App;
