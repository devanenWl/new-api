import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { Layout } from '@douyinfe/semi-ui';

const About = () => {
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!data.startsWith('https://')) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout('Failed to load the About content...');
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
    <>
      {aboutLoaded && about === '' ? (
        <>
          <Layout>
            <Layout.Header>
              <h3>About</h3>
            </Layout.Header>
            <Layout.Content>
              <p>You can set the content about in the settings page, support HTML & Markdown</p>
              New-APIProject Repository Address：
              <a href='https://github.com/Calcium-Ion/new-api'>
                https://github.com/Calcium-Ion/new-api
              </a>
              <p>
                NewAPI © 2023 CalciumIon | 基于 One API v0.5.4 © 2023
                JustSong。
              </p>
              <p>
                本项目根据MIT许可证授权，需在遵守Apache-2.0协议的前提下使用。
              </p>
            </Layout.Content>
          </Layout>
        </>
      ) : (
        <>
          {about.startsWith('https://') ? (
            <iframe
              src={about}
              style={{ width: '100%', height: '100vh', border: 'none' }}
            />
          ) : (
            <div
              style={{ fontSize: 'larger' }}
              dangerouslySetInnerHTML={{ __html: about }}
            ></div>
          )}
        </>
      )}
    </>
  );
};

export default About;
