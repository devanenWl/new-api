import React, { useEffect, useState } from 'react';
import { API, isMobile, showError, showInfo, showSuccess } from '../../helpers';
import {
  renderNumber,
  renderQuota,
  renderQuotaWithAmount,
} from '../../helpers/render';
import {
  Col,
  Layout,
  Row,
  Typography,
  Card,
  Button,
  Form,
  Divider,
  Space,
  Modal,
  Toast,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { Link } from 'react-router-dom';

const TopUp = () => {
  const [redemptionCode, setRedemptionCode] = useState('');
  const [topUpCode, setTopUpCode] = useState('');
  const [topUpCount, setTopUpCount] = useState(0);
  const [minTopupCount, setMinTopUpCount] = useState(1);
  const [amount, setAmount] = useState(0.0);
  const [minTopUp, setMinTopUp] = useState(1);
  const [topUpLink, setTopUpLink] = useState('');
  const [enableOnlineTopUp, setEnableOnlineTopUp] = useState(false);
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [payWay, setPayWay] = useState('');

  const topUp = async () => {
    if (redemptionCode === '') {
      showInfo('请EnterRedeem Code！');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: redemptionCode,
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess('Redeem成功！');
        Modal.success({
          title: 'Redeem成功！',
          content: '成功RedeemQuota：' + renderQuota(data),
          centered: true,
        });
        setUserQuota((quota) => {
          return quota + data;
        });
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError('Request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showError('The super administrator did not set a recharge link!');
      return;
    }
    window.open(topUpLink, '_blank');
  };

  const preTopUp = async (payment) => {
    if (!enableOnlineTopUp) {
      showError('Administrator未开启在线Recharge！');
      return;
    }
    await getAmount();
    if (topUpCount < minTopUp) {
      showError('Recharge数量不能小于' + minTopUp);
      return;
    }
    setPayWay(payment);
    setOpen(true);
  };

  const onlineTopUp = async () => {
    if (amount === 0) {
      await getAmount();
    }
    if (topUpCount < minTopUp) {
      showError('Recharge数量不能小于' + minTopUp);
      return;
    }
    setOpen(false);
    try {
      const res = await API.post('/api/user/pay', {
        amount: parseInt(topUpCount),
        top_up_code: topUpCode,
        payment_method: payWay,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        // showInfo(message);
        if (message === 'success') {
          let params = data;
          let url = res.data.url;
          let form = document.createElement('form');
          form.action = url;
          form.method = 'POST';
          // 判断是否为safari浏览器
          let isSafari =
            navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') < 1;
          if (!isSafari) {
            form.target = '_blank';
          }
          for (let key in params) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          showError(data);
          // setTopUpCount(parseInt(res.data.count));
          // setAmount(parseInt(data));
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      setUserQuota(data.quota);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.top_up_link) {
        setTopUpLink(status.top_up_link);
      }
      if (status.min_topup) {
        setMinTopUp(status.min_topup);
      }
      if (status.enable_online_topup) {
        setEnableOnlineTopUp(status.enable_online_topup);
      }
    }
    getUserQuota().then();
  }, []);

  const renderAmount = () => {
    // console.log(amount);
    return amount + '元';
  };

  const getAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    try {
      const res = await API.post('/api/user/amount', {
        amount: parseFloat(value),
        top_up_code: topUpCode,
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        // showInfo(message);
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: 'Error:' + data, id: 'getAmount' });
          // setTopUpCount(parseInt(res.data.count));
          // setAmount(parseInt(data));
        }
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Layout>
        <Layout.Header>
          <h3>我的钱包</h3>
        </Layout.Header>
        <Layout.Content>
          <Modal
            title='确定要Recharge吗'
            visible={open}
            onOk={onlineTopUp}
            onCancel={handleCancel}
            maskClosable={false}
            size={'small'}
            centered={true}
          >
            <p>Recharge数量：{topUpCount}</p>
            <p>实付金额：{renderAmount()}</p>
            <p>是否确认Recharge？</p>
          </Modal>
          <div
            style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
          >
            <Card style={{ width: '500px', padding: '20px' }}>
              <Title level={3} style={{ textAlign: 'center' }}>
                Balance {renderQuota(userQuota)}
              </Title>
              <div style={{ marginTop: 20 }}>
                <Divider>RedeemBalance</Divider>
                <Form>
                  <Form.Input
                    field={'redemptionCode'}
                    label={'Redeem Code'}
                    placeholder='Redeem Code'
                    name='redemptionCode'
                    value={redemptionCode}
                    onChange={(value) => {
                      setRedemptionCode(value);
                    }}
                  />
                  <Space>
                    {topUpLink ? (
                      <Button
                        type={'primary'}
                        theme={'solid'}
                        onClick={openTopUpLink}
                      >
                        Get Redeem Code
                      </Button>
                    ) : null}
                    <Button
                      type={'warning'}
                      theme={'solid'}
                      onClick={topUp}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Redeeming...' : 'Redeem'}
                    </Button>
                  </Space>
                </Form>
              </div>
              <div style={{ marginTop: 20 }}>
                <Divider>在线Recharge</Divider>
                <Form>
                  <Form.Input
                    disabled={!enableOnlineTopUp}
                    field={'redemptionCount'}
                    label={'实付金额：' + renderAmount()}
                    placeholder={
                      'Recharge数量，最低 ' + renderQuotaWithAmount(minTopUp)
                    }
                    name='redemptionCount'
                    type={'number'}
                    value={topUpCount}
                    onChange={async (value) => {
                      if (value < 1) {
                        value = 1;
                      }
                      setTopUpCount(value);
                      await getAmount(value);
                    }}
                  />
                  <Space>
                    <Button
                      type={'primary'}
                      theme={'solid'}
                      onClick={async () => {
                        preTopUp('zfb');
                      }}
                    >
                      支付宝
                    </Button>
                    <Button
                      style={{
                        backgroundColor: 'rgba(var(--semi-green-5), 1)',
                      }}
                      type={'primary'}
                      theme={'solid'}
                      onClick={async () => {
                        preTopUp('wx');
                      }}
                    >
                      微信
                    </Button>
                  </Space>
                </Form>
              </div>
              {/*<div style={{ display: 'flex', justifyContent: 'right' }}>*/}
              {/*    <Text>*/}
              {/*        <Link onClick={*/}
              {/*            async () => {*/}
              {/*                window.location.href = '/topup/history'*/}
              {/*            }*/}
              {/*        }>Recharge记录</Link>*/}
              {/*    </Text>*/}
              {/*</div>*/}
            </Card>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default TopUp;
