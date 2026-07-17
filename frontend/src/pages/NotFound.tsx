import React from 'react';
import { Result, Button, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Content style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
        />
      </Content>
    </Layout>
  );
};
