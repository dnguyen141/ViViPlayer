import React, { useState, useEffect } from 'react';
import { Comment, Form, Button, List, Input } from 'antd';
import api from '../../utils/api';
import { Notification } from '../../utils/notification';
import Router from 'next/router';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import { connect } from 'react-redux';

const Satz = ({ loadUser }) => {
  const [sentences, setSentences] = useState([])
  const [loading, setLoading] = useState(false)
  //const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [shotRef, setShotRef] = useState();
  const { TextArea } = Input;
  // getSentence();
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

  useEffect(() => {
    getSentence()
  }, [onFinish, loading])

  const getSentence = async () => {
    const req = await api.get('/session/sentences/');
    setSentences(req.data);
    setLoading(!loading);
  }

  const onFinish = async (values, shotref) => {
    try {
      const body = { text: values, shot: shotref }
      const res = await api.post('/session/sentences/', body);
      console.log(res.data);
      Notification('Sentences Notification', 'Sentence successfully written', 'success');
      setValue('');
    } catch (err) {
      const errors = err.response.data.errors;
      console.log(err.response);
      if (errors) {
        errors.forEach((error) => Notification('Sentence Notification', error.message, 'warning'));
      }
    }
  }
  
  const getShotRef = async () => {
    const req = await api.get('/session/shots/');
    console.log(req.data);
    setShotRef(req.data[0]["id"]);
  }

  const handleSubmit = () => {
    if (!value) {
      console.log('run there');
      return;
    }
    getShotRef();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      /*setComments([
        ...comments,
        {
          author: 'User',
          content: <p>{value}</p>,
        }
      ]);*/
      onFinish(value, shotRef);
    }, 1000);
    
    
  };
  
  /*{comments != undefined && <CommentList comments={comments} />}*/
  return (
    <>
      <List
        dataSource={sentences}
        itemLayout="horizontal"
        renderItem={(user) => {
          return (<div><b>{user.author}</b> - Shot {user.shot}: {user.text} <br /> </div>)
        }}
        className="scroll-bar"
      />
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

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { loadUser })(Satz);

