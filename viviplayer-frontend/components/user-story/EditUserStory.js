import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { updateUserStoryById } from '../../actions/session.action';

/**
 * Displays an user interface to edit a userstory.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
const EditUserStory = ({ id, context, updateFunc, updateUserStoryById }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  
  /**
   * Updates a userstory text to the given text.
   * @param {Object} param0 Object containing all the values the userstory should be changed to. 
   */
  const updateUserStory = async ({ damit, moechteichals1, moechteichals2 }) => {
    await updateUserStoryById(damit, moechteichals1, moechteichals2, context.shot, id);
    setIsModalVisible(false);
    updateFunc();
  };
  return (
    <>
      <a onClick={() => setIsModalVisible(true)}>Bearbeiten</a>
      <Modal
        title="Satz bearbeiten"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          
          Alte User Story:
           <i>
              <b style={{ marginLeft: '5px' }}> Damit </b> {context.damit}, <b>möchte ich als </b>
              {context.moechteichals1},{context.moechteichals2}
          </i>
          <br />
          Schreibe hier, um die User Story zu aktualisieren:
          <Form name="User Story aktualisieren" onFinish={updateUserStory} autoComplete="off">
            Damit :
            <Form.Item style={{ marginBottom: '1em' }} name="damit" initialValue={context.damit}>
              <Input rows={4} />
            </Form.Item>
            möchte ich als:
            <Form.Item style={{ marginBottom: '1em' }} name="moechteichals1" initialValue={context.moechteichals1}>
              <Input rows={4} />
            </Form.Item>
            <Form.Item style={{ marginBottom: '1em' }} name="moechteichals2" initialValue={context.moechteichals2}>
              <Input rows={4} />
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
