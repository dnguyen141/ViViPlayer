import React, { useState } from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import moment from 'moment';

function Satz(props) {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const { TextArea } = Input;
  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
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

  const handleSubmit = () => {
    if (!value) {
      console.log('run there');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: 'Josh',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content: <p>{value}</p>,
          datetime: moment().fromNow()
        }
      ]);
      console.log(comments);
    }, 1000);
  };

  return (
    <>
      {comments != undefined && <CommentList comments={comments} />}
      <Comment
        content={
          <Editor
            onChange={(e) => setValue(e.target.value)}
            onSubmit={() => handleSubmit()}
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
