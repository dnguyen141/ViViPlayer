import React, { useState, useEffect } from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import { getSentences } from '../../actions/session.action';
import { connect } from 'react-redux';
const Satz = ({ getSentences, sentences }) => {
  const [comments, setComments] = useState([]);
  const [sentencesList, setSentencesList] = useState(null);
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
  useEffect(() => {
    getSentences();
    setSentencesList(sentences);
  }, []);
  console.log('GET ALL SENTENCES', sentences);
  const handleSubmit = () => {
    if (!value) {
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
          content: <p>{value}</p>
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
              <TextArea
                rows={3}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                placeholder="Bitte geben Sie Ihren Kommentar hier ein"
              />
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

const mapStateToProps = (state) => ({
  sentences: state.session.sentences
});
export default connect(mapStateToProps, { getSentences })(Satz);
