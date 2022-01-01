import React, { useState, useEffect } from 'react';
import {
  Comment,
  Form,
  Button,
  List,
  Input,
  Table,
  InputNumber,
  Modal,
  Space,
  Popconfirm
} from 'antd';
import { getSentences } from '../../actions/session.action';
import { connect } from 'react-redux';
const Satz = ({ getSentences, sentences }) => {
  const [comments, setComments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  useEffect(() => {
    getSentences();
    setSentencesList(sentences);
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
      render: (id) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
              console.log('click', isModalVisible);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sicher zu löschen kann nicht rückgängig machen?"
            onConfirm={() => removeGood(_id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
          <Modal
            title="Edit Text"
            visible={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
          >
            {id}
          </Modal>
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
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (event) => {
        //       fetchGoodById(goods.data[rowIndex]._id);
        //     },
        //   };
        // }}
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
export default connect(mapStateToProps, { getSentences })(Satz);
