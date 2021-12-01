import React from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

function Satz(props) {
  const { TextArea } = Input;

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} />}
    />
  );

  const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
      <Form.Item>
        <TextArea rows={2} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  );
  

  React.Component.state = {
    comments: [],
    submitting: false,
    value: '',
  };

  React.Component.handleSubmit = () => {
    if (!React.Component.state.value) {
      return;
    }

    React.Component.setState({
      submitting: true,
    });

    React.Component.setTimeout(() => {
      React.Component.setState({
        submitting: false,
        value: '',
        comments: [
          ...React.Component.state.comments,
          {
            author: 'User',
            content: <p>{React.Component.state.value}</p>,
            datetime: moment().fromNow(),
          },
        ],
      });
    }, 1000);
  };

  React.Component.handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };


  const { comments, submitting, value } = React.Component.state;

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        content={
          <Editor
            onChange={React.Component.handleChange}
            onSubmit={React.Component.handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
}


Satz.propTypes = {};

export default Satz;
