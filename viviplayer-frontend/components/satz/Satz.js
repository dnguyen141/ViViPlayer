import React, { useState } from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import api from '../../utils/api';

const Satz = (props) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const { TextArea } = Input;
  getSentence();
  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
      className="scroll-bar"
    />
  );

  async function getSentence (){
      const req = await api.get('/session/sentences/');
      console.log(req.data);
      setTimeout(getSentence, 1000);
  }

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('text', values.sentence);
    formData.append('shot', 1);
    const res = await api.post('/session/sentences/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(res.data);
  }

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
        onFinish={onFinish}
        content={
          <>
            <Form.Item name="sentence">
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
