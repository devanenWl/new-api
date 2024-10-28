import React from 'react';
import TokensTable from '../../components/TokensTable';
import { Banner, Layout } from '@douyinfe/semi-ui';
const Token = () => (
  <>
    <Layout>
      <Layout.Header>
        <Banner
          type='warning'
          description='API KeysNone法精确控制使用Quota，请勿直接将API Keys分发给Users。'
        />
      </Layout.Header>
      <Layout.Content>
        <TokensTable />
      </Layout.Content>
    </Layout>
  </>
);

export default Token;
