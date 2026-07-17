import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Button, Spin, Alert, Descriptions } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getJob, type Job } from '../api';
import { JobStatusBadge } from '../components/JobStatusBadge';

const { Header, Content } = Layout;
const { Title } = Typography;

export const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        if (jobId) {
          const data = await getJob(jobId);
          setJob(data);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          navigate('/404', { replace: true });
        } else {
          setError(err.message || 'Failed to fetch job details');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId, navigate]);

  if (loading) {
    return (
      <Layout style={{ height: '100vh' }}>
        <Header style={{ background: '#001529' }} />
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout style={{ height: '100vh' }}>
        <Header style={{ background: '#001529' }} />
        <Content style={{ padding: '50px' }}>
          <Alert
            title="Error"
            description={error || 'Job not found'}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => navigate('/')}>
                Go Back
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const isFailed = job.status === 'failed';
  const hasInconsistentState = job.status === 'running' && job.finished_at !== null;

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          style={{ color: 'white', marginRight: 16 }} 
          onClick={() => navigate('/')}
        />
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Job Details: {job.id}
        </Title>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isFailed && (
            <Alert
              title="Job Failed"
              description={job.last_error || 'An unknown error occurred during job execution.'}
              type="error"
              showIcon
            />
          )}

          {hasInconsistentState && (
            <Alert
              title="Inconsistent State Detected"
              description="This job is marked as running but has a finished timestamp."
              type="warning"
              showIcon
            />
          )}

          <Card>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Job ID">{job.id}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <JobStatusBadge status={job.status} />
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(job.created_at).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Finished At">
                {job.finished_at ? dayjs(job.finished_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};
