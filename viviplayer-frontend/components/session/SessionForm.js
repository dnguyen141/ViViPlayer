import React from 'react';
import { Form, Input, Row, Col, Button, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

function SessionForm(props) {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 12 }
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // const propss = {
  //     action: '//jsonplaceholder.typicode.com/posts/',
  //     listType: 'picture',
  //     previewFile(file) {
  //         console.log('Your upload file:', file);
  //         // Your process logic. Here we just mock to the same file
  //         // change later to match the backend
  //         return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
  //             method: 'POST',
  //             body: file,
  //         })
  //             .then(res => res.json())
  //             .then(({ thumbnail }) => thumbnail);
  //     },
  // };
  return (
    <Row>
      <Col span={7} />
      <Col span={11}>
        <h1>Session Erstellen</h1>
        <Divider />
        <Form
          {...layout}
          name="basic"
          labelAlign="left"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Video Pfad"
            name="video"
            rules={[{ required: true, message: 'Laden Sie bitte ein Video hoch!' }]}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Hochladen</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Session Name"
            name="sessionname"
            rules={[{ required: true, message: 'Name der Session kann nicht Leer sein!' }]}
          >
            <Input placeholder="Geben Sie hier Namen Ihrer Session ein." />
          </Form.Item>
          <Form.Item
            label="TAN"
            name="tan"
            rules={[{ required: true, message: 'Geben Sie bitte Ihre TAN ein!' }]}
          >
            <Input maxLength={20} placeholder="Geben Sie hier 20-stellige TAN ein." />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
              Session erstellen
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={6} />
    </Row>
  );
}

SessionForm.propTypes = {};

export default SessionForm;
