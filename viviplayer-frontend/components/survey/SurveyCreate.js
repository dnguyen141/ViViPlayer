import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { Button, Input, Table, Space, Popconfirm, Form, Select, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { createSurvey } from '../../actions/survey.action';
import { connect } from 'react-redux';
import { WS_BACKEND } from '../../constants/constants';

/**
 * Socket for updates between users.
 */
let socket;

const { Option } = Select;

/**
 * Displays an user interface to create a survey.
 * @param {*} param0 Props being passed to the function.
 * @returns UI to be rendered.
 */
function SurveyCreate({ createSurvey, currentShot, shotData }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ask, setAsk] = useState(null);
  const [shotList, setShotList] = useState(null);
  const [answer, setAnswer] = useState([]);
  const [form] = Form.useForm();
  
  const router = useRouter();
  /**
   * Pathname reffering to the current path.
   */
  const pathName = router.pathname;

  /**
   * Update the shotlist when something changes.
   */
  const updateShotList = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };

  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
  }, []);
  useEffect(() => {
    updateShotList();
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
  /**
   * Gets triggered when the Form gets submitted via the button and updates the question.
   * @param {Object} values New values for the questiom. Value gets automatically set by the onFinish attribute of <Form>
   */
  const createQuestion = async (values) => {
    await createSurvey(
      values.shot,
      values.title,
      values.choices,
      values.correct_answer,
      values.type
    );
    socket.send(
      JSON.stringify({
        action: 'surveyChange',
        time: 0,
        payload: values
      })
    );
    setAsk(values);
    setIsModalVisible(false);
    form.resetFields();
  };
  
  /**
   * Dialogue for creating a question. Part of the response of the component.
   */
  let CreateQuestion = (
    <Form form={form} name="Frage erstellt" onFinish={createQuestion} autoComplete="off">
      <Form.Item
        style={{ marginBottom: '1em' }}
        name="title"
        label="Frage"
        rules={[{ required: true, message: 'Geben Sie hier den Titel der Frage ein.' }]}
      >
        <Input rows={4} placeholder="Geben Sie hier die Frage ein." />
      </Form.Item>
      <Form.Item
        name="shot"
        label="Shot"
        rules={[{ required: true, message: 'Wählen Sie bitte hier ein Shot' }]}
      >
        <Select placeholder="Wählen Sie bitte hier ein Shot" allowClear>
          {pathName === '/video-edit' ? (
            ''
          ) : (
            <Select.Option key="current" value={currentShot}>
              Momentaner Shot
            </Select.Option>
          )}
          {pathName === '/video-edit' ? 
              shotData &&
              shotData.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.title}
                </Option>
              ))
            : shotList &&
              shotList.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.title}
                </Option>
              ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="type"
        label="Typ"
        rules={[{ required: true, message: 'Geben Sie bitte den Typ ein' }]}
      >
        <Select placeholder="Wählen Sie typ von Fragen" allowClear>
          <Option value="checkbox">Umfrage</Option>
          <Option value="radiogroup">Verständnisfrage</Option>
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
        initialValue={''}
        // rules={[{ required: true }]}
      >
        <Input rows={4} placeholder="Geben Sie hier die richtige Antwort ein. (Wenn es eine gibt)" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Posten
      </Button>
    </Form>
  );
  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '5px', marginTop: '5px' }}
      >
        Frage Erstellen
      </Button>
      <Modal
        title="Frage erstellen"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        {CreateQuestion}
      </Modal>
    </div>
  );
}

SurveyCreate.propTypes = {};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createSurvey })(SurveyCreate);
