import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import PropTypes from 'prop-types';
import Answer from './Answer';

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Question(props) {
  const [form] = Form.useForm();

  const onFinish = (values, any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

    return (
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="type" label="Umfragetyp">
        <Select
          placeholder="Bitte wählen Sie Ihren Umfragetyp hier aus"
          allowClear
        >
          <Option value="survey">Umfrage</Option>
          <Option value="question">Verständnisfrage</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
      >
        {({ getFieldValue }) =>
          getFieldValue('type') === 'survey' ? ( //First Option, Umfrage
            <div>
              <Form.Item name="quest" label="Umfrage">
                <Input />
              </Form.Item>
            </div>
          ) : getFieldValue('type') === 'question' ? ( //second Option, Verständnisfrage
            <div>
              <Form.Item name="quest1" label="Frage">
                <Input />
              </Form.Item>
              <Answer />
            </div>
          ) : null
        }
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
    )
}

Question.propTypes = {

}

export default Question

