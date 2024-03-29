import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Button, Input, Table, Space, Popconfirm, Form, Select } from 'antd';
import { getSentences, deleteSentenceById, createSentence } from '../../actions/session.action';
import { connect } from 'react-redux';
import EditSentence from './EditSentence';
import { WS_BACKEND } from '../../constants/constants';

const { TextArea } = Input;

/**
 * Displays an user interface to create, delete and edit a sentence.
 * @param {Object} param0 Props being passed to the function.
 * @returns UI to be rendered.
 */
const Satz = ({ deleteSentenceById, createSentence, user, currentShot }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sentencesList, setSentencesList] = useState(null);
  const [shotList, setShotList] = useState(null);
  const [form] = Form.useForm();


  /**
   * Update the shotlist state.
   */
  const getShot = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };

  
  /**
   * Socket for updates between users.
   */
  const socketRef = useRef(null);
  
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socketRef.current = new WebSocket(url);
    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'sentenceChange') {
        fetchSentenc();
      }
    };
    getShot();
  }, []);


 /**
  * Returns the title of the corresponding shot with the given id.
  * @param {number} shot The id of the shot which title should be returned.
  * @returns Title of the shot with the given id.
  */   
 const getTitle = (shot) => {
     if(shotList){
        for(let i = 0; i < shotList.length; i++){
         if(shotList[i].id == shot){
             return shotList[i].title;
         }
        } 
     }
     
  }

  /**
   * Updates the state of the table locally and for every other user.
   */
  const updateState = () => {
    socketRef.current.send(
      JSON.stringify({
        action: 'sentenceChange',
        time: 0
      })
    );
    setupdateTable(!updateTable);
  };

  /**
   * Updates the SentencesList state.
   */  
  async function fetchSentenc() {
    const res = await api.get('/session/sentences/');
    setSentencesList(res.data);
  }

  useEffect(() => {
    fetchSentenc();
  }, [updateTable]);

   /**
   * Defines the columns of the sentence table.
   */  
  const columns = [
    {
      title: 'User',
      dataIndex: 'author',
      width: '15%',

      render: (author) => <div className="test">{user != null ? <b>{author}</b> : 'user'}</div>
    },
    {
      title: 'Inhalt',
      dataIndex: 'text',
      width: '40%',
      render: (text) => (
        <div className="test">
          <span> {text}</span>
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
            <div>
              <EditSentence id={id} context={record} updateFunc={updateState} />
              <Popconfirm
                title="Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?"
                onConfirm={() => {
                  deleteSentenceById(id);
                  setupdateTable(!updateTable);
                }}
              >
                <a style={{ color: 'red' }}>Löschen</a>
              </Popconfirm>
            </div>
          </Space>
        </div>
      )
    }
  ];

  /**
   * Creates a new sentence.
   * @param {Object} param0 Object containing the new text and shot id.
   */
  const createSentenceFunc = async ({ text, shot }) => {
    await createSentence(text, shot);
    setupdateTable(!updateTable);
    socketRef.current.send(
      JSON.stringify({
        action: 'sentenceChange',
        time: 0
      })
    );
    form.resetFields();
  };

  return (
    <>
      <Table
        columns={columns}
        pagination={false}
        showHeader={false}
        dataSource={sentencesList}
        scroll={{ y: 200 }}
        style={{ minHeight: '250px' }}
      />
      <Form form={form} name="Write sentence" onFinish={createSentenceFunc} autoComplete="off">
        <Form.Item style={{ marginBottom: '1em' }} name="text" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Geben Sie hier ihren Satz ein." />
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

Satz.propTypes = {};

const mapStateToProps = (state) => ({
  sentences: state.session.sentences,
  user: state.auth.user
});
export default connect(mapStateToProps, { getSentences, deleteSentenceById, createSentence })(Satz);
