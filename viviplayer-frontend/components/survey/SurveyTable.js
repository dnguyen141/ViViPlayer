import React, { useEffect, useState } from 'react';
import { Table, Space, Popconfirm } from 'antd';
import SurveyEdit from './SurveyEdit';
import api from '../../utils/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteQuestion } from '../../actions/survey.action';
import { WS_BACKEND } from '../../constants/constants';

let socket;
function SurveyTable({ deleteQuestion }) {
  const [questions, setQuestions] = useState(null);
  const [updateTable, setupdateTable] = useState(false);
  const fetchQuestions = async () => {
    const res = await api.get('/session/questions/');
    setQuestions(res.data);
  };
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'surveyChange') {
        fetchQuestions();
      }
    };
  }, []);
  useEffect(() => {
    fetchQuestions();
  }, [updateTable]);
  const updateState = () => {
    fetchQuestions();
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
      render: (title) => (
        <div>
          <b>{title}</b>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'typeToRender',
      width: '15%',
      render: (type) => <span>{type.checkbox ? 'Survey' : 'Question'}</span>
    },
    {
      title: 'Choices',
      dataIndex: 'choices',
      width: '30%',
      render: (choices) => {
        return choices.map((item, index) => {
          return (
            <div key={index}>
              <span>- {item}</span>
            </div>
          );
        });
      }
    },
    {
      title: 'Shot',
      dataIndex: 'shot',
      width: '15%',
      render: (shot) => (
        <div>
          Shot: <b>{shot}</b>
        </div>
      )
    },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <div>
          <Space size="middle">
            <div>
              <SurveyEdit id={id} context={record} updateFunc={updateState} />
              <Popconfirm
                title="Löschen dieses Satzes ist nicht rückgängig zu machen. Weiter?"
                onConfirm={() => {
                  deleteQuestion(id);
                  updateState();
                  setupdateTable(!updateTable);
                }}
              >
                <a style={{ color: 'red' }}>Delete</a>
              </Popconfirm>
            </div>
          </Space>
        </div>
      )
    }
  ];
  return (
    <>
      <Table
        columns={columns}
        // pagination={false}
        dataSource={questions}
        scroll={{ y: 200 }}
        style={{ minHeight: '300px' }}
      />
    </>
  );
}

SurveyTable.propTypes = {};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { deleteQuestion })(SurveyTable);
