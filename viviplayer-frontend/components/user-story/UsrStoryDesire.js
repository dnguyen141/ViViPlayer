import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { connect } from 'react-redux';
import { Button, Input, Table, Space, Popconfirm, Form } from 'antd';
import EditUserStory from './EditUserStory';
import { createUserStory } from '../../actions/session.action';
const UsrStoryDesire = ({ createUserStory, user }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [userStories, setUserStories] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    async function fetchUserStories() {
      const res = await api.get('/session/userstories/');
      setUserStories(res.data);
    }
    fetchUserStories();
  }, [updateTable]);
  const updateState = () => {
    setupdateTable(!updateTable);
  };
  // create table
  const columns = [
    {
      title: 'user',
      width: '15%',
      render: () => <p>{user.username && <p>{user.username}</p>}</p>
    },
    {
      title: 'Inhalt',
      dataIndex: 'id',
      width: '50%',
      render: (id, record) => (
        <p>
          <b> Damit </b> {record.damit}, <b>möchte ich als </b> {record.moechteichals1},
          {record.moechteichals2}
        </p>
      )
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
        <Space size="middle">
          <EditUserStory id={id} context={record} updateFunc={updateState} />
          <Popconfirm title="Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?">
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const createUserStoryFunc = ({ damit, moechteichals1, moechteichals2, shot }) => {
    createUserStory(damit, moechteichals1, moechteichals2, shot);
    setupdateTable(!updateTable);
  };
  return (
    <>
      <Table
        className="number-table"
        columns={columns}
        pagination={false}
        dataSource={userStories}
        scroll={{ y: 200 }}
      />
      <Form form={form} name="Write sentence" onFinish={createUserStoryFunc} autoComplete="off">
        Damit :
        <Form.Item style={{ marginBottom: '1em' }} name="damit">
          <Input rows={4} placeholder="z.B ich weiss,ob jemand unregelmäßig arbeitet" />
        </Form.Item>
        möchte ich als:
        <Form.Item style={{ marginBottom: '1em' }} name="moechteichals1">
          <Input rows={4} placeholder="z.B Abteilungsleiter" />
        </Form.Item>
        <Form.Item style={{ marginBottom: '1em' }} name="moechteichals2">
          <Input
            rows={4}
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
export default connect(mapStateToProps, { createUserStory })(UsrStoryDesire);
