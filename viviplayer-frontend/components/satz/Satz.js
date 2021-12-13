import React, { useState } from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import EdiText from 'react-editext'

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

  const onSave = (val) => {
    console.log('Edited Value -> ', val)
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
          content: <EdiText 
          showButtonsOnHover 
          editButtonContent="Edit" 
          type='text' 
          value={value} 
          onSave={onSave} 
          saveButtonContent="Bestätigen" 
          cancelButtonContent={<strong>Abbrechen</strong>} 
          hideIcons={true} />,
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
