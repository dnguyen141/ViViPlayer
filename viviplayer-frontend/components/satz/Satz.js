import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Button, Input, Table, Space, Popconfirm, Form } from 'antd';
import { getSentences, deleteSentenceById, createSentence } from '../../actions/session.action';
import { connect } from 'react-redux';
import EditSentence from './EditSentence';
import { Header } from 'antd/lib/layout/layout';

const { TextArea } = Input;
const Satz = ({ deleteSentenceById, createSentence, user }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sentencesList, setSentencesList] = useState(null);
  const [form] = Form.useForm();
  const updateState = () => {
    setupdateTable(!updateTable);
  };
  useEffect(() => {
    async function fetchSentenc() {
      const res = await api.get('/session/sentences/');
      setSentencesList(res.data);
    }
    fetchSentenc();
  }, [updateTable]);
  const columns = [
    {
      title: 'User',
      width: '15%',
      render: () => <div style={{ marginTop: '-25px' }}><b>{user.username && <p>{user.username}</p>}</b></div>
    },
    {
      title: 'Inhalt',
      dataIndex: 'text',
      width: '55%',
      render: (text) => <div style={{ marginTop: '-15px' }}>{text}</div>
    },
    {
      title: 'Shot',
      dataIndex: 'shot',
      width: '10%',
      render: (shot) => <div style={{ textAlign: "center", marginTop: '0px' }}>Shot:<p><b>{shot}</b></p></div>
    },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <div style={{ marginTop: '-28px' }}>
          <Space size="middle">
            <EditSentence id={id} context={record} updateFunc={updateState} />
            <Popconfirm
              title="Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?"
              onConfirm={() => {
                deleteSentenceById(id);
                setupdateTable(!updateTable);
              }}
            >
              <a style={{ color: 'red' }}>
                Delete
              </a>
            </Popconfirm>
          </Space>
        </div>
      )
    }
  ];
  const createSentenceFunc = ({ text, shot }) => {
    createSentence(text, shot);
    setupdateTable(!updateTable);
    form.resetFields();
  };
  return (
    <>
      <Table
        className="number-table"
        columns={columns}
        pagination={false}
        dataSource={sentencesList}
        scroll={{ y: 200 }}
        style={{ minHeight: '250px' }}
      />
      <Form form={form} name="Write sentence" onFinish={createSentenceFunc} autoComplete="off">
        <Form.Item style={{ marginBottom: '1em' }} name="text">
          <TextArea rows={4} placeholder="Geben Sie hier ihren Satz ein." />
        </Form.Item>
        <Form.Item style={{ marginBottom: '1em' }} name="shot">
          <Input placeholder="Geben Sie Shot-Nummer ein." />
        </Form.Item>
        <Button type="primary" htmlType="submit">
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
