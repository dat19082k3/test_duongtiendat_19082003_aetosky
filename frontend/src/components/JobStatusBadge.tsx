import React from 'react';
import { Tag } from 'antd';
import {
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

interface Props {
  status: string;
}

export const JobStatusBadge: React.FC<Props> = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case 'queued':
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          QUEUED
        </Tag>
      );
    case 'running':
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          RUNNING
        </Tag>
      );
    case 'succeeded':
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          SUCCEEDED
        </Tag>
      );
    case 'failed':
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          FAILED
        </Tag>
      );
    default:
      // Handle unrecognized status values gracefully
      return (
        <Tag icon={<QuestionCircleOutlined />} color="warning">
          {status?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      );
  }
};
