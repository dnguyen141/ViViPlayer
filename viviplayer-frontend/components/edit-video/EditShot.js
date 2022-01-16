import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { getShots, updateShotById } from '../../actions/session.action';
const EditShot = ({ id, context, updateFunc, updateShotById }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const updateShot = ({ time, text }) => {
    updateShotById(time, text, id);
    setIsModalVisible(false);
    updateFunc();
  };
  return (
    <>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Edit
      </a>
      <Modal
        title="Shot Bearbeitung"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <i>
            Vorheriger Shot: 
            <b>
              {context.time} - {context.title}
            </b>
          </i>
          <br />
          <Form name="update shot" onFinish={updateShot} autoComplete="off">
          <Form.Item style={{ marginBottom: '1em' }} initialValue={context.time} name="time">
              <Input placeholder="new time stamp" />
            </Form.Item>
            <Form.Item style={{ marginBottom: '1em' }} name="text" initialValue={context.title}>
              <Input placeholder="new shot title" />
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

EditShot.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { getShots, updateShotById })(EditShot);
