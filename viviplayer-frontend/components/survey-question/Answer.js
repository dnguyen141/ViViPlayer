import React from 'react'
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

function Answer(props) {
    const onFinish = values => {
        console.log('Received values of form:', values);
    };
    return (
        <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish}>
            <Form.List
                name="names"
                rules={[{
                    validator: async (_, names) => {
                        if (!names || names.length < 2) {
                            return Promise.reject(new Error('Mindestens zwei Auswahlen!'));
                        }
                    },
                },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? 'Antwort' : ''}
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
                                            message: "Bitte geben Sie Ihre Antwort hier ein.",
                                        },
                                    ]}
                                    noStyle
                                >
                                    <Input placeholder="Bitte hier eingeben." style={{ width: '60%' }} />
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
                                Antwort hinzufügen.
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Form>
    )
}


Answer.propTypes = {}

export default Answer

