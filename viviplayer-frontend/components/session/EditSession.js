import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal, Spin, Paragraph, Divider } from 'antd';
import { connect } from 'react-redux';
import { updateSession } from '../../actions/session.action';


/**
 * Displays an user interface to edit an existing session.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
function EditSession({ id, updateSession, updateFunc }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
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
    setLoading(true);
    let getInfo = await updateSession(formData, id);
    if (getInfo === undefined) {
      setLoading(false);
      return;
    }
    setLoading(false);
    // if (getInfo) {
    //   setVideoInfo(getInfo);
    // }
    updateFunc();
    setIsModalVisible(false);
  };

  /**
   * The video that gets displayed after you upload a video to the server. Its the same as the current video in the session.
   * @param {} videoInfoPara Video information containing the TAN, name and video_path.
   * @returns Video and text that should be displayed.
   */
  const videoBuild = (videoInfoPara) => {
    return (
      <div>
        <h3>
          <Paragraph copyable>
            <b>Name of session::</b> {videoInfoPara.name}
          </Paragraph>
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
      </div>
    );
  };

  /**
   * Logging the error on the console when onFinish fails.
   * @param {*} errorInfo Information of the specific error. Automatically set by onFinishFailed.
   */
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Bearbeiten
      </a>
      <Modal
        title="update session"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form name="basic" labelAlign="left" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
              Session update
            </Button>
          </Form.Item>
        </Form>
        {loading ? (
          <div>
            <span>Das Hochladen von Videos kann einige Zeit dauern </span> <Spin />
          </div>
        ) : (
          ''
        )}
      </Modal>
    </div>
  );
}

EditSession.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { updateSession })(EditSession);
