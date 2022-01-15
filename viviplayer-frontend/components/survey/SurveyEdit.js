import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { Form, Button, Input, Modal, Select } from 'antd';
import { connect } from 'react-redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

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
const SurveyEdit = ({ id, context, updateFunc }) => {
  const [shotList, setShotList] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fieldsData, setFieldsData] = useState([]);

  const getShot = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };
  const updateQuestionInEdit = (values) => {
    console.log(values);
    setIsModalVisible(false);
    updateFunc();
  };
  const updateChoices = (values) => {
    console.log(values);
  };
  useEffect(() => {
    getShot();
    setFieldsData(context.choices);
  }, []);
  return (
    <>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Edit
      </a>
      <Modal
        title="Edit Question"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form name="Update Question" onFinish={updateQuestionInEdit} autoComplete="off">
          <Form.Item
            style={{ marginBottom: '1em' }}
            name="title"
            label=" Title"
            rules={[{ required: true, message: 'Geben Sie hier den Title der Frage ein.' }]}
          >
            <Input rows={4} defaultValue={context.title} />
          </Form.Item>
          <Form.Item
            name="shot"
            label="Shot"
            rules={[{ required: true, message: 'Wählen Sie bitte hier ein Shot' }]}
          >
            <Select
              placeholder="Wählen Sie bitte hier ein Shot"
              allowClear
              defaultValue={context.shot}
            >
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
            <Select
              placeholder="Wählen Sie type von Fragen"
              allowClear
              defaultValue={context.typeToRender}
            >
              <Option value="checkbox">Survey</Option>
              <Option value="radiogroup">Question</Option>
            </Select>
          </Form.Item>
          <Form.List
            name="choices"
            label="Antworte/n"
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
            {(fields, { add, remove }, { errors }) => {
              return (
                <>
                  {fields.map((field, index) => {
                    console.log('field', field);
                    return (
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
                            defaultValue={field}
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
                    );
                  })}
                  <Form.Item wrapperCol={{ offset: 4, span: 21 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '100%' }}
                      icon={<PlusOutlined />}
                    >
                      Antwort bearbeiten
                    </Button>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
          <Form.Item
            style={{ marginBottom: '1em' }}
            name="correct_answer"
            label="Antwort"
            // rules={[{ required: true }]}
          >
            <Input rows={4} defaultValue={context.correct_answer} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
};

SurveyEdit.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(SurveyEdit);
