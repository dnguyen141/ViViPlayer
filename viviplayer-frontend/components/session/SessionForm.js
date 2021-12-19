import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Button, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { loadUser } from '../../actions/auth.action';

function SessionForm(props) {
  // useEffect(() => {
  //   // check for token in LS when app first runs
  //   if (localStorage.token) {
  //     // if there is a token set axios headers for all requests
  //     // setAuthToken(localStorage.token);
  //     axios.defaults.headers.common['Authorization'] = `Token ${localStorage.token}`;
  //   } else {
  //     Router.push('/');
  //   }
  //   // try to fetch a user, if no token or invalid token we
  //   // will get a 401 response from our API
  //   loadUser();

  //   // log user out from all tabs if they log out in one tab
  //   // window.addEventListener('storage', () => {
  //   //   if (!localStorage.token) {
  //   //     type: LOGOUT;
  //   //   }
  //   // });
  // }, []);
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 12 }
  };
  const inputRef = React.useRef();
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append('video_path', file);
    formData.append('name', 'Testiasdasdng');
    formData.append('tan', 'asdasdasdasd23123');
    // const url = URL.createObjectURL(file);

    const res = await api.post('/session/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };
  const onFinish = async (values) => {
    const body = {
      video_path: values.video,
      name: values.name,
      tan: values.tan
    };
    // console.log('BODY', body);
    console.log('VIDEO', values.video.file);
    const formData = new FormData();
    formData.append('video_path', values.video.file);
    formData.append('name', values.name);
    formData.append('tan', values.name);
    console.log('FORMDATA', formData);
    // console.log('Success:', values);
    // console.log('video_path:', values.video.file);
    // console.log('name:', values.name);
    // console.log('tan:', values.tan);

    const res = await api.post('/session/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(res.response);
  };
  const handleChoose = (event) => {
    inputRef.current.click();
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
        <input
          ref={inputRef}
          className="VideoInput_input"
          type="file"
          onChange={handleFileChange}
          accept=".mov,.mp4"
        />
        <button onClick={handleChoose}>Choose</button>
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
            name="name"
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
