import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Button, List, Input, Table, Space, Popconfirm } from 'antd';
import { getSentences, deleteSentenceById } from '../../actions/session.action';
import { connect } from 'react-redux';
import EditSentence from './EditSentence';

const Satz = ({ sentences, deleteSentenceById }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sentencesList, setSentencesList] = useState(null);

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
      title: 'Inhalt',
      dataIndex: 'text',
      render: (text) => <p>{text}</p>
    },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <Space size="middle">
          <EditSentence id={id} context={record} updateFunc={updateState} />
          <Popconfirm
            title="Sicher zu löschen kann nicht rückgängig machen?"
            onConfirm={() => {
              deleteSentenceById(id);
              setupdateTable(!updateTable);
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

  return (
    <>
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
export default connect(mapStateToProps, { getSentences, deleteSentenceById })(Satz);
