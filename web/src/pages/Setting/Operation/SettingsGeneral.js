import React, { useEffect, useState, useRef } from 'react';
import { Banner, Button, Col, Form, Row, Spin } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
} from '../../../helpers';

export default function GeneralSettings(props) {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    TopUpLink: '',
    ChatLink: '',
    ChatLink2: '',
    QuotaPerUnit: '',
    RetryTimes: '',
    DisplayInCurrencyEnabled: false,
    DisplayTokenStatEnabled: false,
    DefaultCollapseSidebar: false,
  });
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);
  function onChange(value, e) {
    const name = e.target.id;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }
  function onSubmit() {
    const updateArray = compareObjects(inputs, inputsRow);
    if (!updateArray.length) return showWarning('你似乎并没有修改什么');
    const requestQueue = updateArray.map((item) => {
      let value = '';
      if (typeof inputs[item.key] === 'boolean') {
        value = String(inputs[item.key]);
      } else {
        value = inputs[item.key];
      }
      return API.put('/api/option/', {
        key: item.key,
        value,
      });
    });
    setLoading(true);
    Promise.all(requestQueue)
      .then((res) => {
        if (requestQueue.length === 1) {
          if (res.includes(undefined)) return;
        } else if (requestQueue.length > 1) {
          if (res.includes(undefined)) return showError('部分保存失败，请Retry');
        }
        showSuccess('保存成功');
        props.refresh();
      })
      .catch(() => {
        showError('保存失败，请Retry');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const currentInputs = {};
    for (let key in props.options) {
      if (Object.keys(inputs).includes(key)) {
        currentInputs[key] = props.options[key];
      }
    }
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current.setValues(currentInputs);
  }, [props.options]);
  return (
    <>
      <Spin spinning={loading}>
        <Banner
          type='warning'
          description={'Chat链接功能已经弃用，请使用下方ChatSettings功能'}
        />
        <Form
          values={inputs}
          getFormApi={(formAPI) => (refForm.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={'General Settings'}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Input
                  field={'TopUpLink'}
                  label={'Recharge Link'}
                  initValue={''}
                  placeholder={'For example, the purchase link of the card issuing website'}
                  onChange={onChange}
                  showClear
                />
              </Col>
              <Col span={8}>
                <Form.Input
                  field={'ChatLink'}
                  label={'DefaultChat Page Link'}
                  initValue={''}
                  placeholder='For example, the deployment address of ChatGPT Next Web'
                  onChange={onChange}
                  showClear
                />
              </Col>
              <Col span={8}>
                <Form.Input
                  field={'ChatLink2'}
                  label={'Chat页面 2 链接'}
                  initValue={''}
                  placeholder='For example, the deployment address of ChatGPT Next Web'
                  onChange={onChange}
                  showClear
                />
              </Col>
              <Col span={8}>
                <Form.Input
                  field={'QuotaPerUnit'}
                  label={'Unit Dollar Quota'}
                  initValue={''}
                  placeholder='Quota that can be exchanged for one unit of currency'
                  onChange={onChange}
                  showClear
                />
              </Col>
              <Col span={8}>
                <Form.Input
                  field={'RetryTimes'}
                  label={'失败Retry次数'}
                  initValue={''}
                  placeholder='失败Retry次数'
                  onChange={onChange}
                  showClear
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Switch
                  field={'DisplayInCurrencyEnabled'}
                  label={'Display quota in the form of currency'}
                  size='large'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={(value) => {
                    setInputs({
                      ...inputs,
                      DisplayInCurrencyEnabled: value,
                    });
                  }}
                />
              </Col>
              <Col span={8}>
                <Form.Switch
                  field={'DisplayTokenStatEnabled'}
                  label={'Billing Related API displays token quota instead of user quota'}
                  size='large'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={(value) =>
                    setInputs({
                      ...inputs,
                      DisplayTokenStatEnabled: value,
                    })
                  }
                />
              </Col>
              <Col span={8}>
                <Form.Switch
                  field={'DefaultCollapseSidebar'}
                  label={'Default折叠侧边栏'}
                  size='large'
                  checkedText='｜'
                  uncheckedText='〇'
                  onChange={(value) =>
                    setInputs({
                      ...inputs,
                      DefaultCollapseSidebar: value,
                    })
                  }
                />
              </Col>
            </Row>
            <Row>
              <Button size='large' onClick={onSubmit}>
                Save General Settings
              </Button>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </>
  );
}
