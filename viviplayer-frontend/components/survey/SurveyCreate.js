import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { Button, Input, Table, Space, Popconfirm, Form, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { createSurvey } from '../../actions/survey.action';
import { connect } from 'react-redux';

const { Option } = Select;
function SurveyCreate({
  setAskFromAdminFunc,
  updateStateFunc,
  createSurvey,
  setIsModalVisibleFunc
}) {
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
    wrapperCol: {
      xs: { span: 21, offset: 4 },
      sm: { span: 21, offset: 4 }
    }
  };
  const formItemLayoutWithOutLabel = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 21, offset: 4 },
      sm: { span: 21, offset: 4 }
    }
  };
  const createQuestion = (values) => {
    console.log(values);
    createSurvey(values.shot, values.title, values.choices, values.correct_answer, values.type);
    setAsk(values);
    setAskFromAdminFunc(values);
    updateStateFunc(values);
    setIsModalVisibleFunc(false);
  };
  let CreateQuestion = (
    <Form name="Frage erstellt" onFinish={createQuestion} autoComplete="off">
      <Form.Item
        style={{ marginBottom: '1em' }}
        name="title"
        label=" Title"
        rules={[{ required: true, message: 'Geben Sie hier den Title der Frage ein.' }]}
      >
        <Input rows={4} placeholder="Geben Sie hier die Frage ein." />
      </Form.Item>
      <Form.Item
        name="shot"
        label="Shot"
        rules={[{ required: true, message: 'Wählen Sie bitte hier ein Shot' }]}
      >
        <Select placeholder="Wählen Sie bitte hier ein Shot" allowClear>
          {shotList &&
            shotList.map((item, index) => (
              <Option value={item.id} key={index}>
                {item.title}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: 'Geben Sie bitte den Typ ein' }]}
      >
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
                return Promise.reject(new Error('Es sind mindestens 2 Antworten erforderlich'));
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
            <Form.Item wrapperCol={{ offset: 4, span: 21 }}>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                Antwort hinzufügen
              </Button>

              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item
        style={{ marginBottom: '1em' }}
        name="correct_answer"
        label="Antwort"
        // rules={[{ required: true }]}
      >
        <Input rows={4} placeholder="Geben Sie hier die richtige Antwort ein.(wenn es gibt)" />
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
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createSurvey })(SurveyCreate);
