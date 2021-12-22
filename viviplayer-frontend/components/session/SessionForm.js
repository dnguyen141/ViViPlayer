import React, { useState } from 'react';
import { Form, Input, Row, Col, Button, Divider, Typography, Spin } from 'antd';
import { createSession } from '../../actions/session.action';
import { connect } from 'react-redux';

function SessionForm({ createSession, sessionInfo }) {
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 }
  };
  const inputRef = React.useRef();
  const handleFileChange = async (event) => {
    let fileVideo = event.target.files[0];
    setFile(fileVideo);
  };
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('video_path', file);
    formData.append('name', values.name);
    formData.append('tan', values.tan);
    setLoading(true);
    let getInfo = await createSession(formData);
    if (getInfo === undefined) {
      setLoading(false);
      return;
    }
    setLoading(false);
    setVideoInfo(getInfo);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  const { Paragraph } = Typography;

  const videoBuild = (videoInfoPara) => {
    return (
      <div>
        <h3>
          <b>Name of session:</b> {videoInfoPara.name}
        </h3>
        <h3>
          <Paragraph copyable>
            <b>TAN:</b> {videoInfoPara.tan}
          </Paragraph>
        </h3>
        <Divider />
        <video controls width="600px" height="350px">
          <source src={videoInfoPara.video_path} type="video/mp4" />
        </video>
        <Button type="primary" style={{ marginLeft: '197px' }}>
          Weiter zu Videobearbeitung
        </Button>
      </div>
    );
  };
  return (
    <Row>
      <Col span={7} />
      <Col span={10}>
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
            <input
              ref={inputRef}
              className="VideoInput_input"
              type="file"
              onChange={handleFileChange}
              accept=".mov,.mp4"
            />
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
          <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
              Session erstellen
            </Button>
          </Form.Item>
          {loading ? (
            <div>
              <span>Das Hochladen von Videos kann einige Zeit dauern </span> <Spin />
            </div>
          ) : (
            ''
          )}
          {videoInfo !== null ? videoBuild(videoInfo) : ''}
        </Form>
      </Col>
      <Col span={7} />
    </Row>
  );
}

SessionForm.propTypes = {};

const mapStateToProps = (state) => ({
  sessionInfo: state.session.sessionInfo
});

export default connect(mapStateToProps, { createSession })(SessionForm);
