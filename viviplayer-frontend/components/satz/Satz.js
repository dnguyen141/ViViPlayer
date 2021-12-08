import React, { useState } from 'react';
import { Comment, Form, Button, List, Input } from 'antd';

const Satz = (props) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const { TextArea } = Input;
  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
      className="scroll-bar"
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
          content: <p>{value}</p>,
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
          <>
            <Form.Item>
              <TextArea rows={3} onChange={(e) => setValue(e.target.value)} value={value} placeholder="Bitte geben Sie Ihren Kommentar hier ein" />
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
};

Satz.propTypes = {};

export default Satz;
