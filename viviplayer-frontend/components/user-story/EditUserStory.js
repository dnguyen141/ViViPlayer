import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Modal } from 'antd';
import { connect } from 'react-redux';
import { getUserStories, updateUserStoryById } from '../../actions/session.action';

const EditUserStory = ({ id, context, updateFunc, updateUserStoryById }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const updateUsrStory = ({ text1, text2, text3 }) => {
        updateUserStoryById(text1, text2, text3, context.shot, id);
        setIsModalVisible(false);
        updateFunc();
    };
    return (
        <>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Edit
            </Button>
            <Modal
                title="Edit User Stories"
                visible={isModalVisible}
                footer={null}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
            >
                <div>
                    <i>
                        Old User Story:
                        <b>
                            {context.damit} {context.moechteichals1} {context.moechteichals2} - {context.shot}
                        </b>
                    </i>
                    <br />
                    <i>write down there to update user story:</i>
                    <Form name="update user story" onFinish={updateUsrStory} autoComplete="off">
                        <Form.Item style={{ marginBottom: '1em' }} name="damit">
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '1em' }} name="moechteichals1">
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: '1em' }} name="moechteichals2">
                            <Input />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

EditUserStory.propTypes = {};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { getUserStories, updateUserStoryById })(EditUserStory);
