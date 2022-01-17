import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { Form, Button, Input, Modal, Select } from 'antd';
import { connect } from 'react-redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { updateSurveyById } from '../../actions/survey.action';

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
const SurveyEdit = ({ id, context, updateFunc, updateSurveyById, shotData }) => {
  const [shotList, setShotList] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fieldsData, setFieldsData] = useState([]);

  const updateShotList = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };
  const  updateQuestionInEdit = async ({ shot, title, choices, correct_answer, type }) => {
    await updateSurveyById(shot, title, choices, correct_answer, type, id);
    setIsModalVisible(false);
    updateFunc();
  };
  const updateChoices = (values) => {
    console.log(values);
  };
  useEffect(() => {
    updateShotList();
    setFieldsData(context.choices);
  }, []);
  return (
    <>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Bearbeiten
      </a>
      <Modal
        title="Question bearbeiten"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form name="Verständnis-/Umfrage Bearbeitung" onFinish={updateQuestionInEdit} autoComplete="off">
          <Form.Item
            style={{ marginBottom: '1em' }}
            name="title"
            label="Frage"
            initialValue={context.title}
            rules={[{ required: true, message: 'Geben Sie hier den Titel der Frage ein.' }]}
          >
            <Input rows={4} />
          </Form.Item>
          <Form.Item
            name="shot"
            label="Shot"
            initialValue={context.shot}
            rules={[{ required: true, message: 'Wählen Sie bitte hier ein Shot' }]}
          >
            <Select placeholder="Wählen Sie bitte hier ein Shot" allowClear>
              {shotData &&
                shotData.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="Typ"
            initialValue={context.typeToRender}
            rules={[{ required: true, message: 'Geben Sie bitte den Typ ein' }]}
          >
            <Select placeholder="Wählen Sie type von Fragen" allowClear>
              <Option value="checkbox">Umfrage</Option>
              <Option value="radiogroup">Verständnisfrage</Option>
            </Select>
          </Form.Item>
          <Form.List
            name="choices"
            label="Antwort/en"
            initialValue={context.choices}
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
                      Antwort hinzufügen
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
            initialValue={context.correct_answer}
          >
            <Input rows={4} placeholder="Geben Sie hier die richtige Antwort ein.(wenn es gibt)" />
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
export default connect(mapStateToProps, { updateSurveyById })(SurveyEdit);
