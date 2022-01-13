import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { Button, Input, Table, Space, Popconfirm, Form, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
function SurveyCreate({ setAskFromAdminFunc, updateStateFunc }) {
  const [ask, setAsk] = useState(null);
  const [shotList, setShotList] = useState(null);
  const getShot = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };
  useEffect(() => {
    getShot();
  }, []);
  const formItemLayout = {
    labelCol: {
      xs: { span: 0 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 0 },
      sm: { span: 21 }
    }
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 21, offset: 0 },
      sm: { span: 21, offset: 0 }
    }
  };
  const createQuestion = (values) => {
    console.log(values);
    setAsk(values);
    setAskFromAdminFunc(values);
    updateStateFunc(values);
  };
  let CreateQuestion = (
    <Form name="Frage erstellt" onFinish={createQuestion} autoComplete="off">
      <Form.Item style={{ marginBottom: '1em' }} name="title" rules={[{ required: true }]}>
        <Input rows={4} placeholder="Geben Sie hier die Frage ein." />
      </Form.Item>
      <Form.Item name="shot" rules={[{ required: true }]}>
        <Select placeholder="Wählen Sie bitte hier ein Shot" allowClear>
          {shotList && shotList.map((item) => <Option value={item.id}>{item.title}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item name="type" rules={[{ required: true }]}>
        <Select placeholder="Wählen Sie type von Fragen" allowClear>
          <Option value="checkbox">Survey</Option>
          <Option value="radiogroup">Question</Option>
        </Select>
      </Form.Item>
      <Form.List
        name="choices"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('mindesten 2 Antworten zu haben'));
              }
            }
          }
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Geben Sie bitte die Antwort ein'
                    }
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="Antwort"
                    style={{ width: '95%', marginRight: '2px' }}
                    icon={<PlusOutlined />}
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '83%' }}
                icon={<PlusOutlined />}
              >
                Antwort hinzufügen
              </Button>

              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item style={{ marginBottom: '1em' }} name="correct_answer" rules={[{ required: true }]}>
        <Input rows={4} placeholder="Geben Sie hier die richtige Antwort ein." />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Posten
      </Button>
    </Form>
  );
  return (
    <div>
      <h3>Fragen erstellen</h3>
      {CreateQuestion}
    </div>
  );
}

SurveyCreate.propTypes = {};

export default SurveyCreate;
