import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { connect } from 'react-redux';
import { Button, Input, Table, Space, Popconfirm, Form } from 'antd';
import EditUserStory from './EditUserStory';
import styles from './user-story.module.css';
import { WS_BACKEND } from '../../constants/constants';
let socket;
import { createUserStory, deleteUserStoryById } from '../../actions/session.action';
const UsrStoryDesire = ({ createUserStory, user, deleteUserStoryById }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [userStories, setUserStories] = useState(null);
  const [form] = Form.useForm();

  async function fetchUserStories() {
    const res = await api.get('/session/userstories/');
    setUserStories(res.data);
  }

  useEffect(() => {
    fetchUserStories();
  }, [updateTable]);
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'userStoryChange') {
        fetchUserStories();
      }
    };
  }, []);
  const updateState = () => {
    socket.send(
      JSON.stringify({
        action: 'userStoryChange',
        time: 0
      })
    );
    setupdateTable(!updateTable);
  };
  // create table
  const columns = [
    {
      title: 'User',
      width: '15%',
      render: () => <div>{user.username && <b>{user.username}</b>}</div>
    },
    {
      title: 'Inhalt',
      dataIndex: 'id',
      width: '55%',
      render: (id, record) => (
        <div>
          <b> Damit </b> {record.damit}, <b>möchte ich als </b> {record.moechteichals1},{' '}
          {record.moechteichals2}
        </div>
      )
    },
    {
      title: 'Shot',
      dataIndex: 'shot',
      width: '15%',
      render: (shot) => (
        <div>
          Shot:<b>{shot}</b>
        </div>
      )
    },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <div>
          <Space size="middle">
            <EditUserStory id={id} context={record} updateFunc={updateState} />
            <Popconfirm
              title="Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?"
              onConfirm={() => {
                deleteUserStoryById(id);
                updateState();
              }}
            >
              <a style={{ color: 'red' }}>Delete</a>
            </Popconfirm>
          </Space>
        </div>
      )
    }
  ];

  const createUserStoryFunc = ({ damit, moechteichals1, moechteichals2, shot }) => {
    createUserStory(damit, moechteichals1, moechteichals2, shot);
    updateState();
    form.resetFields();
  };
  return (
    <>
      <Table
        columns={columns}
        showHeader={false}
        pagination={false}
        dataSource={userStories}
        scroll={{ y: 200 }}
        style={{ minHeight: '250px' }}
      />
      <Form form={form} name="Write sentence" onFinish={createUserStoryFunc} autoComplete="off">
        Damit :
        <Form.Item style={{ marginBottom: '0.5em' }} name="damit">
          <Input
            className={styles.inputuser}
            rows={4}
            placeholder="z.B ich weiss,ob jemand unregelmäßig arbeitet"
          />
        </Form.Item>
        möchte ich als:
        <Form.Item style={{ marginBottom: '0.2em' }} name="moechteichals1">
          <Input className={styles.inputuser} rows={4} placeholder="z.B Abteilungsleiter" />
        </Form.Item>
        <Form.Item style={{ marginBottom: '1em' }} name="moechteichals2">
          <Input
            rows={4}
            className={styles.inputuser}
            placeholder="z.B eine visuelle Darstellung der geleisteten Stunden sehen"
          />
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

UsrStoryDesire.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { createUserStory, deleteUserStoryById })(UsrStoryDesire);
