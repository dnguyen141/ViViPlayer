import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { updateUserStoryById } from '../../actions/session.action';

const EditUserStory = ({ id, context, updateFunc, updateUserStoryById }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const updateUserStory = ({ damit, moechteichals1, moechteichals2 }) => {
    updateUserStoryById(damit, moechteichals1, moechteichals2, context.shot, id);
    setIsModalVisible(false);
    updateFunc();
  };
  return (
    <>
      <a onClick={() => setIsModalVisible(true)}>
        Edit
      </a>
      <Modal
        title="Edit Sentences"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <i>
            Old UserStory:
            <b> Damit </b> {context.damit}, <b>möchte ich als </b> {context.moechteichals1},
            {context.moechteichals2}
          </i>
          <br />
          <i>write down there to update user story:</i>
          <Form name="Write sentence" onFinish={updateUserStory} autoComplete="off">
            Damit :
            <Form.Item style={{ marginBottom: '1em' }} name="damit">
              <Input rows={4} placeholder="z.B ich weiss,ob jemand unregelmäßig arbeitet" />
            </Form.Item>
            möchte ich als:
            <Form.Item style={{ marginBottom: '1em' }} name="moechteichals1">
              <Input rows={4} placeholder="z.B Abteilungsleiter" />
            </Form.Item>
            <Form.Item style={{ marginBottom: '1em' }} name="moechteichals2">
              <Input
                rows={4}
                placeholder="z.B eine visuelle Darstellung der geleisteten Stunden sehen"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  );
};

EditUserStory.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { updateUserStoryById })(EditUserStory);
