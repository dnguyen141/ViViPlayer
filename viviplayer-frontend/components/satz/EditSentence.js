import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { getSentences, updateSentenceById } from '../../actions/session.action';
const EditSentence = ({ id, context, updateFunc, updateSentenceById }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const updateSen = ({ text }) => {
    updateSentenceById(text, context.shot, id);
    setIsModalVisible(false);
    updateFunc();
  };
  return (
    <>
      <a onClick={() => setIsModalVisible(true)} style={{ marginRight: '1em' }}>
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
            Alter Satz:
            <b style={{ marginLeft: '4px' }}>
              {context.text} - {context.shot}
            </b>
          </i>
          <br />
          <i>schreib dort hin, um den Satz zu aktualisieren:</i>
          <Form name="Update Satz" onFinish={updateSen} autoComplete="off">
            <Form.Item style={{ marginBottom: '1em' }} name="text">
              <Input placeholder="neuer Satz" />
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

EditSentence.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { getSentences, updateSentenceById })(EditSentence);
