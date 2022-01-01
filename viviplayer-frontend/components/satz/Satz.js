import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Comment,
  Form,
  Button,
  List,
  Input,
  Table,
  Space,
  Popconfirm
} from 'antd';
import { getSentences, updateSentenceById } from '../../actions/session.action';
import { connect } from 'react-redux';
import EditSentence from './EditSentence';

const Satz = ({ getSentences, sentences, updateSentenceById }) => {
  const [comments, setComments] = useState([]);
  const [updateTable, setupdateTable] = useState(false);
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

  const updateState = () => {
    console.log('UPDATE TABLE');
    setupdateTable(!updateTable);
  };
  useEffect(() => {
    console.log('reupdate table');
    async function fetchSentenc() {
      const res = await api.get('/session/sentences/');
      setSentencesList(res.data);
    }
    fetchSentenc();
    console.log('REUP', sentences);
  }, [updateTable]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <p>{id}</p>
    },
    {
      title: 'Inhalt',
      dataIndex: 'text',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'Action',
      dataIndex: 'id',
      render: (id, record) => (
        <Space size="middle">
          <EditSentence id={id} context={record} updateFunc={updateState} />
          <Popconfirm
            title="Sicher zu löschen kann nicht rückgängig machen?"
            onConfirm={() => {
              console.log(id);
            }}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
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
      <Table
        className="number-table"
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={sentencesList}
      />
    </>
  );
};

Satz.propTypes = {};

const mapStateToProps = (state) => ({
  sentences: state.session.sentences
});
export default connect(mapStateToProps, { getSentences, updateSentenceById })(Satz);
