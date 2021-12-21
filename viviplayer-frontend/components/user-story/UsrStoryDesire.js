import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Comment, Form, Button, List, Input } from 'antd';
import styles from './user-story.module.css';
import api from '../../utils/api';
import { Notification } from '../../utils/notification';
import Router from 'next/router';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import { connect } from 'react-redux';

const UsrStoryDesire = ({ loadUser }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [shotRef, setShotRef] = useState();
  const [value1, setValue1] = useState(''); //value1 for the first text box
  const [value2, setValue2] = useState(''); //value2 for the second text box
  const [value3, setValue3] = useState(''); ///value3 for the third text box
  /*const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(props) => <Comment {...props} />}
      className="scroll-bar"
    />
  );*/

  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    } else {
      Router.push('/');
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    loadUser();

    // log user out from all tabs if they log out in one tab
    // window.addEventListener('storage', () => {
    //   if (!localStorage.token) {
    //     type: LOGOUT;
    //   }
    // });
  }, []);


  const getStories = async () => {
    const req = await api.get('/session/userstories/');
    setStories(req.data);
    setLoading(!loading);
  }

  const onFinish = async (values, shotref) => {
    try {
      const body = { desc: values, shot: 20 }
      const res = await api.post('/session/userstories/', body);
      console.log(res.data);
      Notification('Story Notification', 'User Story successfully submitted', 'success');
      setValue1('');
      setValue2('');
      setValue3('');
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(err.response);
      if (errors) {
        errors.forEach((error) => Notification('Story Notification', error.message, 'warning'));
      }
    }
  }

  useEffect(() => {
    getStories()
  }, [onFinish, loading])

  const getShotRef = async () => {
    const req = await api.get('/session/shots/');
    console.log(req.data);
    setShotRef(req.data.body);
  }

  const handleSubmit = () => {
    if (!value1 || !value2 || !value3) {
      console.log('run there');
      return;
    }
    getShotRef();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue1('');
      setValue2('');
      setValue3('');
      /*setComments([
        ...comments,
        {
          author: 'User',
          content: (
            <p>
              Damit {value1}, möchte ich als {value2}, {value3}.
            </p>
          ),
        }
      ]);*/
      console.log(comments);
      onFinish("Damit " + `${value1}` + ", möchte ich als " + `${value2}` + ", " + `${value3}` + ".")
    }, 1000);
  };

  const onReset = () => {
    setValue1('');
    setValue2('');
    setValue3('');
  };

  /*{comments != undefined && <CommentList comments={comments} />}*/
  return (
    <>
      <List
        dataSource={stories}
        itemLayout="horizontal"
        renderItem={(user) => {
          return (<div><b>{user.author}</b> - <i>Shot {user.shot}</i>: {user.desc} <br /> </div>)
        }}
        className="scroll-bar"
      />
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

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { loadUser })(UsrStoryDesire);
