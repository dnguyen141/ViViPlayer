import React, { useEffect, useState } from 'react';
import { Table, Space, Popconfirm } from 'antd';
import { useRouter } from 'next/router';
import Router from 'next/router';
import SurveyEdit from './SurveyEdit';
import api from '../../utils/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
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

/**
 * Socket for updates between users.
 */
let socket;

/**
 * Displays a table of all surveys.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
function SurveyTable({ deleteQuestion, shotData }) {
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
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    } else {
      Router.push('/');
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    loadUser();
  }, []);

  useEffect(() => {
    if (questions != null && idQuestion != null) {
      setIdquestion(idQuestion);
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
   
  /**
  * Returns the title of the corresponding shot with the given id. Works with props and only in video-edit.
  * @param {number} shot The id of the shot which title should be returned.
  * @returns Title of the shot with the given id.
  */    
  const getTitle = (shot) => {
    if (shotData) {
      for (let i = 0; i < shotData.length; i++) {
        if (shotData[i].id == shot) {
          return shotData[i].title;
        }
      }
    }
  };

  /**
  * Returns the title of the corresponding shot with the given id. Works with ShotList state and only in video-edit.
  * @param {number} shot The id of the shot which title should be returned.
  * @returns Title of the shot with the given id.
  */ 
  const getShotTitle = (shot) => {
    if (shotList) {
      for (let i = 0; i < shotList.length; i++) {
        if (shotList[i].id == shot) {
          return shotList[i].title;
        }
      }
    }
  };

   /**
   * Update the shotlist when something changes.
   */    
  const updateShotList = async () => {
    const shotsData = await api.get('/session/shots/');
    setShotList(shotsData);
  };

  /**
   * Updates the statistic state if something changes.
   */
  const fetchStatistic = async () => {
    const res = await api.get(`/session/statistics/${idQuestion}/`);
    setStatistic(res.data);
  };

  /**
   * Updates the question data state if something changes.
   */
  const fetchQuestion = async () => {
    const res = await api.get(`/session/questions/${idQuestion}/`);
    setQuestionData(res.data);
  };

  const router = useRouter();

  /**
   * Pathname reffering to the current path.
   */
  const pathName = router.pathname;

  /**
   * Updates the state of the questions if something changes.
   */
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
      } else if (data.action === 'statisticChange') {
        fetchQuestions();
      }
    };
  }, []);
  useEffect(() => {
    fetchQuestions();
  }, [updateTable]);

  /**
   * Updates the State of the questions.
   */
  const updateState = () => {
    fetchQuestions();
  };

   /**
   * Defines the columns of the survey table.
   */  
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
      render: (type) => <span>{type === 'checkbox' ? 'Umfrage' : 'Frage'}</span>
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
      render: (shot) => <div>{pathName === '/video' ? getShotTitle(shot) : getTitle(shot)}</div>
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
                <SurveyEdit id={id} context={record} updateFunc={updateState} shotData={shotData} />
                <Popconfirm
                  title="Löschen dieser Frage ist nicht rückgängig zu machen. Weiter?"
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
                    setIdquestion(id);
                    socket.send(
                      JSON.stringify({
                        action: 'questionFromServer',
                        time: statistic,
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
                <a
                  style={{ color: '#228B22' }}
                  onClick={() => {
                    setIdquestion(id);
                  }}
                >
                  Statistik
                </a>
              </div>
            </Space>
          )}
        </div>
      )
    }
  ];

  /**
   * Options for the statistic.
   */
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
