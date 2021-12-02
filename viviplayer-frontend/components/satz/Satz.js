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
      className='scroll-bar'
    />
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
          author: 'User',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content: <p>{value}</p>,
          datetime: moment().fromNow()
        }
      ]);
      console.log(comments);
    }, 1000);
  };
  const handleChange = (e) => {
    console.log('run there', e);
    e.preventDefault();
    setValue(e.target.value);
  };

  return (
    <>
      {comments != undefined && <CommentList comments={comments} />}
      <Comment
        content={
          <>
            <Form.Item>
              <TextArea rows={2} onChange={handleChange} value={value} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                Kommentieren
              </Button>
            </Form.Item>
          </>
        }
      />
    </>
  );
}

Satz.propTypes = {};

export default Satz;
