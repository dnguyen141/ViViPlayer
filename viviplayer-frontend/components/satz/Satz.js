import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Button, Input, Table, Space, Popconfirm, Form } from 'antd';
import { getSentences, deleteSentenceById, createSentence } from '../../actions/session.action';
import { connect } from 'react-redux';
import EditSentence from './EditSentence';
import { WS_BACKEND } from '../../constants/constants';

let socket;

const { TextArea } = Input;
const Satz = ({ deleteSentenceById, createSentence, user }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sentencesList, setSentencesList] = useState(null);
  const [form] = Form.useForm();
  // connect to socket and update sentence table
  useEffect(() => {
    const url = WS_BACKEND + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'sentenceChange') {
        fetchSentenc();
      }
    };
  }, []);

  const updateState = () => {
    socket.send(JSON.stringify({
      'action': 'sentenceChange',
      'time': 0
    }));
    setupdateTable(!updateTable);
  };

  async function fetchSentenc() {
    const res = await api.get('/session/sentences/');
    setSentencesList(res.data);
  }

  useEffect(() => {
    fetchSentenc();
  }, [updateTable]);
  const columns = [
    {
      title: 'User',
      width: '15%',
      render: () => (
        <p>
          <b>{user.username && <p>{user.username}</p>}</b>
        </p>
      )
    },
    {
      title: 'Inhalt',
      dataIndex: 'text',
      width: '50%',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'Shot',
      dataIndex: 'shot',
      width: '10%',
      render: (shot) => <p>{shot}</p>
    },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <Space size='middle'>
          <EditSentence id={id} context={record} updateFunc={updateState} />
          <Popconfirm
            title='Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?'
            onConfirm={() => {
              deleteSentenceById(id);
              setupdateTable(!updateTable);
              socket.send(JSON.stringify({
                'action': 'sentenceChange',
                'time': 0
              }));
            }}
          >
            <Button type='primary' danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
  const createSentenceFunc = ({ text, shot }) => {
    createSentence(text, shot);
    setupdateTable(!updateTable);
    socket.send(JSON.stringify({
      'action': 'sentenceChange',
      'time': 0
    }));
    form.resetFields();
  };
  return (
    <>
      <Table
        className='number-table'
        columns={columns}
        pagination={false}
        dataSource={sentencesList}
        scroll={{ y: 200 }}
      />
      <Form form={form} name='Write sentence' onFinish={createSentenceFunc} autoComplete='off'>
        <Form.Item style={{ marginBottom: '1em' }} name='text'>
          <TextArea rows={4} placeholder='Geben Sie hier ihren Satz ein.' />
        </Form.Item>
        <Form.Item style={{ marginBottom: '1em' }} name='shot'>
          <Input placeholder='Geben Sie Shot-Nummer ein.' />
        </Form.Item>
        <Button type='primary' htmlType='submit'>
          Posten
        </Button>
      </Form>
    </>
  );
};

Satz.propTypes = {};

const mapStateToProps = (state) => ({
  sentences: state.session.sentences,
  user: state.auth.user
});
export default connect(mapStateToProps, { getSentences, deleteSentenceById, createSentence })(Satz);
