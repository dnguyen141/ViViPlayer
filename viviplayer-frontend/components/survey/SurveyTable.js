import React, { useEffect, useState } from 'react';
import { Table, Space, Popconfirm } from 'antd';
import { useRouter } from 'next/router';
import SurveyEdit from './SurveyEdit';
import api from '../../utils/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteQuestion, getQuestionId } from '../../actions/survey.action';
import { WS_BACKEND } from '../../constants/constants';
import { Notification } from '../../utils/notification';
import SurveyStatistic from '../survey/SurveyStatistic';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
let socket;
let preDataSet = [
  {
    label: 'Dataset 1',
    data: [1],
    backgroundColor: 'rgba(255, 99, 132, 0.5)'
  },
  {
    label: 'Dataset 2',
    data: [5],
    backgroundColor: 'rgba(53, 162, 235, 0.5)'
  }
];
function SurveyTable({ deleteQuestion, getQuestionId }) {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const [questions, setQuestions] = useState(null);
  const [updateTable, setupdateTable] = useState(false);
  const [idQuestion, setIdquestion] = useState(null);
  const [labels, setLablels] = useState([]);
  const [statistic, setStatistic] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [test, setTest] = useState([
    {
      label: 'Dataset 1',
      data: [1, 2],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'Dataset 2',
      data: [5, 4],
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]);
  useEffect(() => {
    fetchStatistic();
    fetchQuestion();
  }, [idQuestion]);
  useEffect(() => {
    console.log(questionData);
    let arr = [];
    setLablels(questionData != null ? questionData.choices : []);
    if (statistic != null) {
      console.log(statistic.data);
      preDataSet = statistic.data.map((item, index = 50) => ({
        label: item.choice,
        data: arr.push(item.quantity),
        backgroundColor: `rgba(${53 + index}, 162, ${235 + index}, 0.5)`
        // backgroundColor: 'red'
      }));
      setTest(
        statistic.data.map((item, index = 50) => ({
          label: item.choice,
          data: [item.quantity],
          backgroundColor: `rgba(${53 + index}, 162, ${235 + index}, 0.5)`
          // backgroundColor: 'red'
        }))
      );
    }

    console.log(preDataSet);
  }, [questionData, statistic, idQuestion]);
  const fetchStatistic = async () => {
    const res = await api.get(`/session/statistics/${idQuestion}/`);
    setStatistic(res.data);
  };
  const fetchQuestion = async () => {
    const res = await api.get(`/session/questions/${idQuestion}/`);
    setQuestionData(res.data);
    console.log(res.data);
  };
  const router = useRouter();
  const fetchQuestions = async () => {
    const res = await api.get('/session/questions/');
    setQuestions(res.data);
  };
  const pathName = router.pathname;
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
      render: (type) => <span>{type === 'checkbox' ? 'Survey' : 'Question'}</span>
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
          {pathName === '/video-edit' ? (
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
          ) : (
            <Space size="middle">
              <div>
                <a
                  style={{ color: '#1890ff', marginRight: '1em' }}
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        action: 'questionFromServer',
                        time: 0,
                        payload: record
                      })
                    );
                    Notification(
                      'Question notification',
                      'The question was sent to everyone in the session',
                      'success'
                    );
                  }}
                >
                  Frage
                </a>
                <a style={{ color: '#228B22' }} onClick={() => setIdquestion(id)}>
                  Statistic
                </a>
              </div>
            </Space>
          )}
        </div>
      )
    }
  ];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: statistic != null ? statistic.question_title : ''
      }
    }
  };

  const data = {
    labels,
    datasets: test
  };
  console.log(data);
  return (
    <>
      <Table
        columns={columns}
        // pagination={false}
        dataSource={questions}
        scroll={{ y: 200 }}
        style={{ minHeight: '300px' }}
      />
      <Bar options={options} data={data} />
    </>
  );
}

SurveyTable.propTypes = {};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { deleteQuestion, getQuestionId })(SurveyTable);
