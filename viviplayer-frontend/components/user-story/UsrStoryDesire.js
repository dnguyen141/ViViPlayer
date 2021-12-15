import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Comment, Form, Button, List, Input } from 'antd';
import styles from './user-story.module.css';

function UsrStoryDesire(props) {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value1, setValue1] = useState(''); //value1 for the first text box
  const [value2, setValue2] = useState(''); //value2 for the second text box
  const [value3, setValue3] = useState(''); ///value3 for the third text box
  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
      className="scroll-bar"
    />
  );

  const handleSubmit = () => {
    if (!value1 || !value2 || !value3) {
      console.log('run there');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue1('');
      setValue2('');
      setValue3('');
      setComments([
        ...comments,
        {
          author: 'User',
          content: (
            
            <p>
              Damit {value1}, möchte ich als {value2}, {value3}.
            </p>
          ),
        }
      ]);
      console.log(comments);
    }, 1000);
  };

  const onReset = () => {
    setValue1('');
    setValue2('');
    setValue3('');
  };

  return (
    <>
      {comments != undefined && <CommentList comments={comments} />}
      <Comment
        content={
          <>
            <Form>
              <Form.Item name="label">
                <div>
                  <div style={{ paddingTop: '0.4em' }}>Damit</div>
                  <div>
                    <Input
                      className={styles.inputuser}
                      placeholder='z.B. ich weiß, ob jemand unregelmäßig arbeitet'
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ paddingTop: '0.4em' }}>möchte ich als</div>
                  <div>
                    <Input
                      className={styles.inputuser}
                      placeholder='z.B. Abteilungsleiter'
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ paddingTop: '0.4em' }} />
                  <div>
                    <Input
                      className={styles.inputuser}
                      placeholder='z.B. eine visuelle Darstellung der geleisteten Stunden sehen'
                      value={value3}
                      onChange={(e) => setValue3(e.target.value)}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ margin: '5px', fontSize: '14px', marginLeft: '0px', marginBottom: '0px' }}
                  htmlType="submit"
                  loading={submitting}
                  onClick={handleSubmit}
                >
                  Posten
                </Button>
                <Button
                  htmlType="button"
                  style={{ margin: '5px', fontSize: '14px', marginBottom: '0px' }}
                  onClick={onReset}
                >
                  Zurücksetzen
                </Button>
              </Form.Item>
            </Form>
          </>
        }
      />
    </>
  );
}

UsrStoryDesire.propTypes = {};

export default UsrStoryDesire;
