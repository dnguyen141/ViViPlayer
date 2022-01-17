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
function SurveyTable({ deleteQuestion }) {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const [questions, setQuestions] = useState(null);
  const [updateTable, setupdateTable] = useState(false);
  const [idQuestion, setIdquestion] = useState(null);
  const [labels, setLablels] = useState([]);
  const [statistic, setStatistic] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [shotList, setShotList] = useState(null);
  const [test, setTest] = useState([
    {
      label: 'Dataset 1',
      data: [1, 2],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }
  ]);
  useEffect(() => {
    if (questions != null && idQuestion != null) {
      setIdquestion(idQuestion);
      console.log('run inside');
      fetchStatistic();
      fetchQuestion();
    }
    updateShotList();
  }, [questions, idQuestion]);
  useEffect(() => {
    setLablels(questionData != null ? questionData.choices : []);
    if (statistic != null) {
      let arr = statistic.data.map((item) => item.quantity);
      setTest([
        {
          label: 'Dataset',
          data: arr,
          backgroundColor: 'rgba(174, 164, 235, 0.4)'
        }
      ]);
    }
  }, [questionData, statistic, idQuestion]);


  const getTitle = (shot) => {
     if(shotList){
        for(let i = 0; i < shotList.length; i++){
         if(shotList[i].id == shot){
             return shotList[i].title;
         }
        } 
     }
     
  }

  const updateShotList = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData.data);
  };
  const fetchStatistic = async () => {
    const res = await api.get(`/session/statistics/${idQuestion}/`);
    setStatistic(res.data);
  };
  const fetchQuestion = async () => {
    const res = await api.get(`/session/questions/${idQuestion}/`);
    setQuestionData(res.data);
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
      } else if (data.action === 'statisticChange') {
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
      title: 'Frage',
      dataIndex: 'title',
      width: '20%',
      render: (title) => (
        <div>
          <b>{title}</b>
        </div>
      )
    },
    {
      title: 'Typ',
      dataIndex: 'typeToRender',
      width: '15%',
      render: (type) => <span>{type === 'checkbox' ? 'Survey' : 'Question'}</span>
    },
    {
      title: 'Auswahl',
      dataIndex: 'choices',
      width: '25%',
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
       width: '20%',
       render: (shot) => <div>{getTitle(shot)}</div>,
      
       
     },
    {
      title: 'Aktionen',
      dataIndex: 'id',
      width: '20%',
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
                  <a style={{ color: 'red' }}>Löschen</a>
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
                      'Umfrage Benachrichtigung',
                      'Die Frage wurde an alle in der Sitzung gesendet',
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
        pagination={false}
        dataSource={questions}
        scroll={{ y: 200 }}
        style={{ minHeight: '300px' }}
      />
      {pathName === '/video-edit' ? '' : <Bar options={options} data={data} />}
    </>
  );
}

SurveyTable.propTypes = {};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { deleteQuestion, getQuestionId })(SurveyTable);
