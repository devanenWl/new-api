import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row } from '@douyinfe/semi-ui';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';

const Home = () => {
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        const htmlNotice = marked(data);
        showNotice(htmlNotice, true);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
    } else {
      showError(message);
      setHomePageContent('Failed to load homepage content...');
    }
    setHomePageContentLoaded(true);
  };

  const getStartTimeString = () => {
    const timestamp = statusState?.status?.start_time;
    return statusState.status ? timestamp2string(timestamp) : '';
  };

  useEffect(() => {
    displayNotice().then();
    displayHomePageContent().then();
  }, []);
  return (
    <>
      {homePageContentLoaded && homePageContent === '' ? (
        <>
          <Card
            bordered={false}
            headerLine={false}
            title='System status'
            bodyStyle={{ padding: '10px 20px' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Card
                  title='System information'
                  headerExtraContent={
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--semi-color-text-1)',
                      }}
                    >
                      System information overview
                    </span>
                  }
                >
                  <p>Name:{statusState?.status?.system_name}</p>
                  <p>
                    Version:
                    {statusState?.status?.version
                      ? statusState?.status?.version
                      : 'unknown'}
                  </p>
                  <p>
                    Source code:
                    <a
                      href='https://github.com/Calcium-Ion/new-api'
                      target='_blank'
                      rel='noreferrer'
                    >
                      https://github.com/Calcium-Ion/new-api
                    </a>
                  </p>
                  <p>
                    协议：
                    <a
                      href='https://www.apache.org/licenses/LICENSE-2.0'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Apache-2.0 License
                    </a>
                  </p>
                  <p>Startup time:{getStartTimeString()}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title='System configuration'
                  headerExtraContent={
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--semi-color-text-1)',
                      }}
                    >
                      System configuration overview
                    </span>
                  }
                >
                  <p>
                    Email verification:
                    {statusState?.status?.email_verification === true
                      ? 'Enabled'
                      : 'Not enabled'}
                  </p>
                  <p>
                    GitHub Authentication：
                    {statusState?.status?.github_oauth === true
                      ? 'Enabled'
                      : 'Not enabled'}
                  </p>
                  <p>
                    WeChat Authentication：
                    {statusState?.status?.wechat_login === true
                      ? 'Enabled'
                      : 'Not enabled'}
                  </p>
                  <p>
                    Turnstile user verification:
                    {statusState?.status?.turnstile_check === true
                      ? 'Enabled'
                      : 'Not enabled'}
                  </p>
                  <p>
                    Telegram 身份验证：
                    {statusState?.status?.telegram_oauth === true
                      ? 'Enabled'
                      : 'Not enabled'}
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </>
      ) : (
        <>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              style={{ width: '100%', height: '100vh', border: 'none' }}
            />
          ) : (
            <div
              style={{ fontSize: 'larger' }}
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            ></div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
