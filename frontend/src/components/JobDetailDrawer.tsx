import React from 'react';
import { Drawer, Descriptions, Alert, Space } from 'antd';
import dayjs from 'dayjs';
import type { Job } from '../api';
import { JobStatusBadge } from './JobStatusBadge';

interface Props {
  job: Job | null;
  visible: boolean;
  onClose: () => void;
}



export const JobDetailDrawer: React.FC<Props> = ({ job, visible, onClose }) => {
  if (!job) return null;

  const isFailed = job.status.toLowerCase() === 'failed';

  // Handle inconsistent timestamps: 
  // Document says "a job with a finished_at set while its status is still running" 
  // We just display what we have, safely formatting the dates.
  const formatTime = (timeStr: string | null) => 
    timeStr ? dayjs(timeStr).format('YYYY-MM-DD HH:mm:ss') : 'N/A';

  return (
    <Drawer
      title={`Job Details: ${job.id}`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="ID">{job.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <JobStatusBadge status={job.status} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatTime(job.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Finished At">
            {formatTime(job.finished_at)}
          </Descriptions.Item>
        </Descriptions>

        {isFailed && (
          <Alert
            title="Job Failed"
            description={job.last_error || 'An unknown error occurred during job execution.'}
            type="error"
            showIcon
          />
        )}

        {/* Warning if there's an inconsistent timestamp */}
        {job.status.toLowerCase() === 'running' && job.finished_at && (
          <Alert
            title="Inconsistent State Detected"
            description="This job is marked as running but has a finished timestamp."
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Drawer>
  );
};
