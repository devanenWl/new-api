import React, { useEffect, useRef, useState } from 'react';
import { Banner, Button, Col, Form, Row } from '@douyinfe/semi-ui';
import { API, showError, showSuccess } from '../helpers';
import { marked } from 'marked';

const OtherSetting = () => {
  let [inputs, setInputs] = useState({
    Notice: '',
    SystemName: '',
    Logo: '',
    Footer: '',
    About: '',
    HomePageContent: '',
  });
  let [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    tag_name: '',
    content: '',
  });

  const updateOption = async (key, value) => {
    setLoading(true);
    const res = await API.put('/api/option/', {
      key,
      value,
    });
    const { success, message } = res.data;
    if (success) {
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const [loadingInput, setLoadingInput] = useState({
    Notice: false,
    SystemName: false,
    Logo: false,
    HomePageContent: false,
    About: false,
    Footer: false,
  });
  const handleInputChange = async (value, e) => {
    const name = e.target.id;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  // General Settings
  const formAPISettingGeneral = useRef();
  // General Settings - Notice
  const submitNotice = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Notice: true }));
      await updateOption('Notice', inputs.Notice);
      showSuccess('Announcement已更新');
    } catch (error) {
      console.error('Announcement更新失败', error);
      showError('Announcement更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Notice: false }));
    }
  };
  // Personalization Settings
  const formAPIPersonalization = useRef();
  //  Personalization Settings - SystemName
  const submitSystemName = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        SystemName: true,
      }));
      await updateOption('SystemName', inputs.SystemName);
      showSuccess('System Name已更新');
    } catch (error) {
      console.error('System Name更新失败', error);
      showError('System Name更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        SystemName: false,
      }));
    }
  };

  // Personalization Settings - Logo
  const submitLogo = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Logo: true }));
      await updateOption('Logo', inputs.Logo);
      showSuccess('Logo 已更新');
    } catch (error) {
      console.error('Logo 更新失败', error);
      showError('Logo 更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Logo: false }));
    }
  };
  // Personalization Settings - Home Page Content
  const submitOption = async (key) => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        HomePageContent: true,
      }));
      await updateOption(key, inputs[key]);
      showSuccess('Home Page Content已更新');
    } catch (error) {
      console.error('Home Page Content更新失败', error);
      showError('Home Page Content更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        HomePageContent: false,
      }));
    }
  };
  // Personalization Settings - About
  const submitAbout = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, About: true }));
      await updateOption('About', inputs.About);
      showSuccess('About内容已更新');
    } catch (error) {
      console.error('About内容更新失败', error);
      showError('About内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, About: false }));
    }
  };
  // Personalization Settings - Footer
  const submitFooter = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Footer: true }));
      await updateOption('Footer', inputs.Footer);
      showSuccess('Footer内容已更新');
    } catch (error) {
      console.error('Footer内容更新失败', error);
      showError('Footer内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Footer: false }));
    }
  };

  const openGitHubRelease = () => {
    window.location = 'https://github.com/songquanpeng/one-api/releases/latest';
  };

  const checkUpdate = async () => {
    const res = await API.get(
      'https://api.github.com/repos/songquanpeng/one-api/releases/latest',
    );
    const { tag_name, body } = res.data;
    if (tag_name === process.env.REACT_APP_VERSION) {
      showSuccess(`Is the latest version：${tag_name}`);
    } else {
      setUpdateData({
        tag_name: tag_name,
        content: marked.parse(body),
      });
      setShowUpdateModal(true);
    }
  };
  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        if (item.key in inputs) {
          newInputs[item.key] = item.value;
        }
      });
      setInputs(newInputs);
      formAPISettingGeneral.current.setValues(newInputs);
      formAPIPersonalization.current.setValues(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <Row>
      <Col span={24}>
        {/* General Settings */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPISettingGeneral.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={'General Settings'}>
            <Form.TextArea
              label={'Announcement'}
              placeholder={'Enter the new announcement content here, supports Markdown & HTML code'}
              field={'Notice'}
              onChange={handleInputChange}
              style={{ fontFamily: 'JetBrains Mono, Consolas' }}
              autosize={{ minRows: 6, maxRows: 12 }}
            />
            <Button onClick={submitNotice} loading={loadingInput['Notice']}>
              SettingsAnnouncement
            </Button>
          </Form.Section>
        </Form>
        {/* Personalization Settings */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPIPersonalization.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={'Personalization Settings'}>
            <Form.Input
              label={'System Name'}
              placeholder={'Enter the system name here'}
              field={'SystemName'}
              onChange={handleInputChange}
            />
            <Button
              onClick={submitSystemName}
              loading={loadingInput['SystemName']}
            >
              Set system name
            </Button>
            <Form.Input
              label={'Logo Image URL'}
              placeholder={'Enter the Logo image URL here'}
              field={'Logo'}
              onChange={handleInputChange}
            />
            <Button onClick={submitLogo} loading={loadingInput['Logo']}>
              Settings Logo
            </Button>
            <Form.TextArea
              label={'Home Page Content'}
              placeholder={
                'Enter the homepage content here, supports Markdown & HTML code. Once set, the status information of the homepage will not be displayed. If a link is entered, it will be used as the src attribute of the iframe, allowing you to set any webpage as the homepage.。'
              }
              field={'HomePageContent'}
              onChange={handleInputChange}
              style={{ fontFamily: 'JetBrains Mono, Consolas' }}
              autosize={{ minRows: 6, maxRows: 12 }}
            />
            <Button
              onClick={() => submitOption('HomePageContent')}
              loading={loadingInput['HomePageContent']}
            >
              SettingsHome Page Content
            </Button>
            <Form.TextArea
              label={'About'}
              placeholder={
                'Enter new about content here, supports Markdown & HTML code. If a link is entered, it will be used as the src attribute of the iframe, allowing you to set any webpage as the about page.。'
              }
              field={'About'}
              onChange={handleInputChange}
              style={{ fontFamily: 'JetBrains Mono, Consolas' }}
              autosize={{ minRows: 6, maxRows: 12 }}
            />
            <Button onClick={submitAbout} loading={loadingInput['About']}>
              SettingsAbout
            </Button>
            {/*  */}
            <Banner
              fullMode={false}
              type='info'
              description='Removal of One API copyright mark must first be authorized. Project maintenance requires a lot of effort. If this project is meaningful to you, please actively support it.。'
              closeIcon={null}
              style={{ marginTop: 15 }}
            />
            <Form.Input
              label={'Footer'}
              placeholder={
                'Enter the new footer here, leave blank to use the default footer, supports HTML code.'
              }
              field={'Footer'}
              onChange={handleInputChange}
            />
            <Button onClick={submitFooter} loading={loadingInput['Footer']}>
              Set Footer
            </Button>
          </Form.Section>
        </Form>
      </Col>
      {/*<Modal*/}
      {/*  onClose={() => setShowUpdateModal(false)}*/}
      {/*  onOpen={() => setShowUpdateModal(true)}*/}
      {/*  open={showUpdateModal}*/}
      {/*>*/}
      {/*  <Modal.Header>New Version：{updateData.tag_name}</Modal.Header>*/}
      {/*  <Modal.Content>*/}
      {/*    <Modal.Description>*/}
      {/*      <div dangerouslySetInnerHTML={{ __html: updateData.content }}></div>*/}
      {/*    </Modal.Description>*/}
      {/*  </Modal.Content>*/}
      {/*  <Modal.Actions>*/}
      {/*    <Button onClick={() => setShowUpdateModal(false)}>Close</Button>*/}
      {/*    <Button*/}
      {/*      content='Details'*/}
      {/*      onClick={() => {*/}
      {/*        setShowUpdateModal(false);*/}
      {/*        openGitHubRelease();*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Modal.Actions>*/}
      {/*</Modal>*/}
    </Row>
  );
};

export default OtherSetting;
