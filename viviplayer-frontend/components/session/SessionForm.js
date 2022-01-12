import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Button, Divider, Typography, Spin } from 'antd';
import { createSession } from '../../actions/session.action';
import { connect } from 'react-redux';
import { WS_BACKEND, VIDEO_PREFIX } from '../../constants/constants';
let socket;
function SessionForm({ createSession, sessionInfo, updateLayoutState, updateLayout }) {
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
  }, []);
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
    formData.append('is_opened', true);
    setLoading(true);
    let getInfo = await createSession(formData);
    if (getInfo === undefined) {
      setLoading(false);
      return;
    }
    setLoading(false);
    setVideoInfo(getInfo);
    updateLayout(!updateLayoutState);
    socket.send(
      JSON.stringify({
        action: 'updateSession',
        time: 0
      })
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  const { Paragraph } = Typography;

  const videoBuild = (videoInfoPara) => {
    return (
      <div className="row-responsive">
        <h3>
          <Paragraph copyable>
            <b>Name of session:</b> {videoInfoPara.name}
          </Paragraph>
        </h3>
        <h3>
          <Paragraph copyable>
            <b>TAN:</b> {videoInfoPara.tan}
          </Paragraph>
        </h3>
        <Divider />
        <video data-setup='{"fluid":true}' controls width="100%" height="100%">
          <source src={VIDEO_PREFIX + videoInfoPara.video_path} type="video/mp4" />
        </video>
        <Button type="primary" style={{ margin: '0px 125px' }}>
          Weiter zu Videobearbeitung
        </Button>
      </div>
    );
  };
  return (
    <div>
      <h2>Session Erstellen</h2>
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
    </div>
  );
}

SessionForm.propTypes = {};

const mapStateToProps = (state) => ({
  sessionInfo: state.session.sessionInfo
});

export default connect(mapStateToProps, { createSession })(SessionForm);
