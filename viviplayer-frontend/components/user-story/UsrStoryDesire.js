import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Button, List, Input, Table, Space, Popconfirm, Form } from 'antd';
import { getUserStories, deleteUserStoryById, createUserStory } from '../../actions/session.action';
import { connect } from 'react-redux';
import styles from './user-story.module.css';
import EditUserStory from './EditUserStory';

const UsrStoryDesire = ({ deleteUserStoryById, createUserStory, user }) => {
  const [updateTable, setUpdateTable] = useState(false);
  const [userStoryList, setUserStoryList] = useState(null);
  const [form] = Form.useForm();
  const updateState = () => {
    setUpdateTable(!updateTable);
  };
  useEffect(() => {
    async function fetchStory() {
      const res = await api.get('/session/userstories/');
      setUserStoryList(res.data);
    }
    fetchStory();
  }, [updateTable]);
  console.log(user);
  const columns = [
    {
      title: 'user',
      width: '15%',
      render: () => <p>{user.username && <p>{user.username}</p>}</p>
    },
    {
      title: 'Inhalt',
      dataIndex: 'text',
      width: '50%',
      render: (damit, moechte1, moechte2) => <p>damit {damit}, möchte ich als {moechte1}, {moechte2}</p>
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
          <Popconfirm
            title="Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?"
            onConfirm={() => {
              deleteUserStoryById(id);
              setUpdateTable(!updateTable);
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
  const createSentenceFunc = ({ damit, moechte1, moechte2, shot }) => {
    createUserStory(damit, moechte1, moechte2, shot);
    setUpdateTable(!updateTable);
    form.resetFields();
  };

  return (
    <>
      <Table
        className="number-table"
        columns={columns}
        pagination={false}
        dataSource={userStoryList}
        scroll={{ y: 200 }}
      />
      <Form form={form} name="Write user story" onFinish={createSentenceFunc} autoComplete="off">
        <div>Damit</div>
        <Form.Item name="damit">
          <Input
            className={styles.inputuser}
            placeholder='z.B. ich weiß, ob jemand unregelmäßig arbeitet'
          />
        </Form.Item>
        <div>möchte ich als</div>
        <Form.Item name="moechte1">
          <Input
            className={styles.inputuser}
            placeholder='z.B. Abteilungsleiter'
          />
        </Form.Item>
        <Form.Item name="moechte2">
          <Input
            className={styles.inputuser}
            placeholder='z.B. eine visuelle Darstellung der geleisteten Stunden sehen'
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: '1em' }} name="shot">
          <Input placeholder="Geben Sie Shot-Nummer ein." />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            style={{ margin: '5px', fontSize: '14px', marginLeft: '0px', marginBottom: '0px' }}
            htmlType="submit"
          >
            Posten
          </Button>
          <Button
            htmlType="button"
            style={{ margin: '5px', fontSize: '14px', marginBottom: '0px' }}
          >
            Zurücksetzen
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

UsrStoryDesire.propTypes = {};
const mapStateToProps = (state) => ({
  userstories: state.session.userstories,
  user: state.auth.user
});
export default connect(mapStateToProps, { getUserStories, deleteUserStoryById, createUserStory })(UsrStoryDesire);