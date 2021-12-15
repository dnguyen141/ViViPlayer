import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 4 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 2,
      },
    },
  };

function RegisterForm(props) {
    const [form] = Form.useForm();

    const onFinish = (values, any) => {
    console.log('Received values of form: ', values);
    };
    
    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
        >
            <Form.Item
                name="email"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: 'Bitte geben Sie Ihren Namen ein.',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Kennwort"
                rules={[
                    {
                        required: true,
                        message: 'Bitte geben Sie Ihr Kennwort ein.',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Kennwort bestätigen"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Bitte bestätigen Sie Ihr Kennwort!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Die Kennwörter übereinstimmen nicht!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Registrieren
                </Button>
            </Form.Item>
        </Form>
    )
}

RegisterForm.propTypes = {

}

export default RegisterForm

