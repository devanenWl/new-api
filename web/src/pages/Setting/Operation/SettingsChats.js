import React, { useEffect, useState, useRef } from 'react';
import { Banner, Button, Col, Form, Popconfirm, Row, Space, Spin } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
  verifyJSON,
  verifyJSONPromise
} from '../../../helpers';

export default function SettingsChats(props) {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    Chats: "[]",
  });
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState(inputs);

  async function onSubmit() {
    try {
      console.log('Starting validation...');
      await refForm.current.validate().then(() => {
        console.log('Validation passed');
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
            value
          });
        });
        setLoading(true);
        Promise.all(requestQueue)
          .then((res) => {
            if (requestQueue.length === 1) {
              if (res.includes(undefined)) return;
            } else if (requestQueue.length > 1) {
              if (res.includes(undefined))
                return showError('部分保存失败，请Retry');
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
      }).catch((error) => {
        console.error('Validation failed:', error);
        showError('请检查Enter');
      });
    } catch (error) {
      showError('请检查Enter');
      console.error(error);
    }
  }

  async function resetModelRatio() {
    try {
      let res = await API.post(`/api/option/rest_model_ratio`);
      // return {success, message}
      if (res.data.success) {
        showSuccess(res.data.message);
        props.refresh();
      } else {
        showError(res.data.message);
      }
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    const currentInputs = {};
    for (let key in props.options) {
      if (Object.keys(inputs).includes(key)) {
        if (key === 'Chats') {
          const obj = JSON.parse(props.options[key]);
          currentInputs[key] = JSON.stringify(obj, null, 2);
        } else {
          currentInputs[key] = props.options[key];
        }
      }
    }
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    refForm.current.setValues(currentInputs);
  }, [props.options]);

  return (
    <Spin spinning={loading}>
      <Form
        values={inputs}
        getFormApi={(formAPI) => (refForm.current = formAPI)}
        style={{ marginBottom: 15 }}
      >
        <Form.Section text={'API KeysChatSettings'}>
          <Banner
            type='warning'
            description={'必须将上方Chat链接AllSettings为空，才能使用下方ChatSettings功能'}
          />
          <Banner
            type='info'
            description={'链接中的{key}将自动替换为sk-xxxx，{address}将自动替换为System settings的Server Address，末尾不带/和/v1'}
          />
          <Form.TextArea
            label={'Chat配置'}
            extraText={''}
            placeholder={'Is a JSON text'}
            field={'Chats'}
            autosize={{ minRows: 6, maxRows: 12 }}
            trigger='blur'
            stopValidateWithError
            rules={[
              {
                validator: (rule, value) => {
                  return verifyJSON(value);
                },
                message: '不是合法的 JSON 字符串'
              }
            ]}
            onChange={(value) =>
              setInputs({
                ...inputs,
                Chats: value
              })
            }
          />
        </Form.Section>
      </Form>
      <Space>
        <Button onClick={onSubmit}>
          保存ChatSettings
        </Button>
      </Space>
    </Spin>
  );
}
