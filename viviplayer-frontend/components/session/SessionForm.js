import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Button, Divider, Typography, Spin } from 'antd';
import { createSession } from '../../actions/session.action';
import { connect } from 'react-redux';
import Router from 'next/router';
import { WS_BACKEND, VIDEO_PREFIX } from '../../constants/constants';

/**
 * Socket for updates between users.
 */
let socket;


/**
 * Displays an user interface to create, edit and delete a session.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
function SessionForm({ createSession, sessionInfo, updateLayoutState, updateLayout }) {
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
  }, []);
  /**
   * Layout for the Form.
   */
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 }
  };
  /**
   * Reference for the video input.
   */
  const inputRef = React.useRef();

  /**
   * Update the File state when it changes.
   * @param {Event} event Event triggering on change. Automatically given by onChange property of the input.
   */
  const handleFileChange = async (event) => {
    let fileVideo = event.target.files[0];
    setFile(fileVideo);
  };

  /**
   * Gets triggered when the Form gets submitted via the button and updates the session.
   * @param {Object} values New values for the session. Value gets automatically set by the onFinish attribute of <Form>
   */
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

  /**
   * Logging the error on the console when onFinish fails.
   * @param {*} errorInfo Information of the specific error. Automatically set by onFinishFailed.
   */   
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'

  const { Paragraph } = Typography;

  /**
   * The video that gets displayed after you upload a video to the server. Its the same as the current video in the session.
   * @param {} videoInfoPara Video information containing the TAN, name and video_path.
   * @returns Video and text that should be displayed.
   */
  const videoBuild = (videoInfoPara) => {
    return (
      <div className="row-responsive">
        <h3>
          <Paragraph copyable>
            <b>Name der Session:</b> {videoInfoPara.name}
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
        <Button type="primary" style={{ float : 'right' }} onClick={(e) => Router.push("/video-edit")}>
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
