import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal, Spin, Paragraph, Divider } from 'antd';
import { connect } from 'react-redux';
import { updateSession } from '../../actions/session.action';
function EditSession({ id, updateSession, updateFunc }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const inputRef = React.useRef();
  const handleFileChange = async (event) => {
    let fileVideo = event.target.files[0];
    setFile(fileVideo);
  };
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
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Edit
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
