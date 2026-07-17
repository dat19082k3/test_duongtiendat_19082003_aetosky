import React from 'react';
import { Result, Button, Layout } from 'antd';

const { Content } = Layout;

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: React.ReactNode;
}

export class ServerError extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
          <Content style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Result
              status="500"
              title="500"
              subTitle="Sorry, something went wrong with the application."
              extra={
                <Button type="primary" onClick={() => window.location.href = '/'}>
                  Back Home
                </Button>
              }
            />
          </Content>
        </Layout>
      );
    }

    return this.props.children;
  }
}
