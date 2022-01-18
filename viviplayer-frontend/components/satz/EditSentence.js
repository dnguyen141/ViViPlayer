import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { getSentences, updateSentenceById } from '../../actions/session.action';
import api from '../../utils/api';

/**
 * Displays an user interface to edit an existing sentence.
 * @param {Object} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
const EditSentence = ({ id, context, updateFunc, updateSentenceById }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Updates a sentence text to the given text.
   * @param {Object} param0 Object containing the text the Sentence should be changed to. 
   */
  const updateSen = async ({ text }) => {
    await updateSentenceById(text, context.shot, id);
    setIsModalVisible(false);
    updateFunc();
  };

  return (
    <>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
        Bearbeiten
      </a>
      <Modal
        title="Satz bearbeiten"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          
            Alter Satz:
           <i> <b style={{ marginLeft: '4px' }}>
                {context.text} - {context.shot}
            </b>
          </i>
          <br />
          Schreib hier, um den Satz zu aktualisieren:
          <Form name="Update Satz" onFinish={updateSen} autoComplete="off">
            <Form.Item style={{ marginBottom: '1em' }} name="text" initialValue={context.text}>
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Senden
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  );
};

EditSentence.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { getSentences, updateSentenceById })(EditSentence);
