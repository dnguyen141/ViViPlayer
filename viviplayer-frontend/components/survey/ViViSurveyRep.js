import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Table, Space, Popconfirm, Form, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import * as Survey from 'survey-react';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 0 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 0 },
    sm: { span: 24 }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 }
  }
};
const ViViSurveyRep = (props) => {
  const json = {
    pages: [
      {
        title: 'VIVI Fragen',
        elements: [
          {
            type: 'checkbox',
            name: 'answer',
            title: 'which color do you like?',
            isRequired: true,
            choices: ['Green', 'Red', 'Black', 'Yellow']
          }
        ]
      }
    ]
  };
  const survey = new Survey.Model(json);
  survey.onComplete.add((sender) => {
    console.log(sender.data);
  });
  const createQuestion = (values) => {
    console.log(values);
  };
  return (
    <>
      <h3>Fragen erstellen</h3>
      <Form name="Frage erstellt" onFinish={createQuestion} autoComplete="off">
        <Form.Item style={{ marginBottom: '1em' }} name="title" rules={[{ required: true }]}>
          <Input rows={4} placeholder="Geben Sie hier ihren Satz ein." />
        </Form.Item>
        <Form.Item name="type" rules={[{ required: true }]}>
          <Select placeholder="Wählen Sie type von Fragen" allowClear>
            <Option value="checkbox">Check Box</Option>
            <Option value="radiogroup">Radio Group</Option>
          </Select>
        </Form.Item>
        <Form.List
          name="asks"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error('mindesten 2 Options zu wählen'));
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
                        message: 'Geben Sie bitte die Antworten ein'
                      }
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Antwort"
                      style={{ width: '100%' }}
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
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>

                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Button type="primary" htmlType="submit">
          Posten
        </Button>
      </Form>
      {/* <Survey.Survey model={survey} completeText="Send" /> */}
    </>
  );
};

ViViSurveyRep.propTypes = {};

export default ViViSurveyRep;
