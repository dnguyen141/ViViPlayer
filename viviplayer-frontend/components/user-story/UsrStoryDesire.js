import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { connect } from 'react-redux';
import { Button, Input, Table, Space, Popconfirm, Form, Select } from 'antd';
import EditUserStory from './EditUserStory';
import styles from './user-story.module.css';
import { VIDEO_PREFIX, WS_BACKEND } from '../../constants/constants';
let socket;
import { createUserStory, deleteUserStoryById } from '../../actions/session.action';
const UsrStoryDesire = ({ createUserStory, user, deleteUserStoryById, currentShot }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [userStories, setUserStories] = useState(null);
  const [shotList, setShotList] = useState(null);
  const [form] = Form.useForm();

  async function fetchUserStories() {
    const res = await api.get('/session/userstories/');
    setUserStories(res.data);
    console.log(res.data);
  }
  const updateShotList = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };
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
    updateShotList();
  }, []);

  const getTitle = (shot) => {
     if(shotList){
        for(let i = 0; i < shotList.length; i++){
         if(shotList[i].id == shot){
             return shotList[i].title;
         }
        } 
     }
     
  }
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
      dataIndex: 'author',
      width: '15%',
      render: (author) => <div className="test">{user != null ? <b>{author}</b> : 'user'}</div>
    },
    {
      title: 'Inhalt',
      dataIndex: 'id',
      width: '40%',
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
       width: '20%',
       render: (shot) => <div><b>Shot: {getTitle(shot)}</b></div>,
      
       
     },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      width: '25%',
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
              <a style={{ color: 'red' }}>Löschen</a>
            </Popconfirm>
          </Space>
        </div>
      )
    }
  ];

  const createUserStoryFunc = async ({ damit, moechteichals1, moechteichals2, shot }) => {
    await createUserStory(damit, moechteichals1, moechteichals2, shot);
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
      <Form
        form={form}
        name="User Story schreiben"
        onFinish={createUserStoryFunc}
        autoComplete="off"
      >
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
        <Form.Item name="shot" rules={[{ required: true }]}>
          <Select placeholder="Wählen Sie bitte hier einen Shot">
            <Select.Option key="current" value={currentShot}>
              Momentaner Shot
            </Select.Option>
            {shotList && shotList.map((item) => <Option value={item.id}>{item.title}</Option>)}
          </Select>
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
