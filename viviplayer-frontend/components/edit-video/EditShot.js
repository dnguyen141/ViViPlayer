import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { getShots, updateShotById } from '../../actions/session.action';
import { Notification } from '../../utils/notification';

/**
 * Displays an user interface to edit an existing shot.
 * @param {*} param0 Props being passed to the function.
 * @returns UI to be rendered.
 */
const EditShot = ({ id, context, updateFunc, updateShotById, videoRef }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

   /**
    * Updates the shot and closes the form.
    * @param {Object} param0 Object containing time and text to edit to update the shot.
   */ 
  const updateShot = ({ time, text }) => {
    if(time <= videoRef.current.duration && time >= 0){
        updateShotById(time, text, id);
        setIsModalVisible(false);
    } else {
      Notification('Shot Benachrichtigung', "Der angebene Zeitstempel ist fehlerhaft.", 'warning');
    }
    
    updateFunc();  
  };
  return (
    <>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Bearbeiten
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
          <Form.Item style={{ marginBottom: '1em' }} initialValue={context.time} name="time" rules={[{ required: true, message: 'Bitte neuen Zeitstempel eingeben.' }]}>
              <Input placeholder="Neuer Zeitstempel" />
            </Form.Item>
            <Form.Item style={{ marginBottom: '1em' }} name="text" initialValue={context.title} rules={[{ required: true, message: 'Bitte neuen Titel eingeben.' }]}>
              <Input placeholder="Neuer Titel" />
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
