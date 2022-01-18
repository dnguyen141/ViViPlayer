import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Survey from 'survey-react';
import api from '../../utils/api';
import { Spin } from 'antd';
import { WS_BACKEND } from '../../constants/constants';
import { sendAnswer } from '../../actions/survey.action';
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
 * Displays an user interface to respond to a survey.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
const SurveyRep = ({ sendAnswer }) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const [ask, setAsk] = useState(null);
  const [labels, setLablels] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [idQuestion, setIdquestion] = useState(null);
  const [statistic, setStatistic] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [answered, setAnswered] = useState(false);
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
      fetchStatistic(idQuestion);
      fetchQuestion();
    }
  }, [questions, idQuestion]);
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'questionFromServer') {
        localStorage.setItem('questionID', data.payload.id);
        setAnswered(false);
        setIdquestion(data.payload.id);
        setAsk(data.payload);
      } else if (data.action === 'statisticChange') {
        fetchStatistic();
      }
    };
  }, []);

  /**
   * Updates the statistic state if something changes.
   */
  const fetchStatistic = async () => {
    try {
      const res = await api.get(`/session/statistics/${idQuestion}/`);
      setStatistic(res.data);
    } catch (error) {
      setStatistic(null);
    }
  };

  /**
   * Updates the question data state if something changes.
   */
  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/session/questions/${idQuestion}/`);
      setQuestionData(res.data);
    } catch (error) {
      setQuestionData(null);
    }
  };

  /**
   * Updates the state of the questions if something changes.
   */
  const fetchQuestions = async () => {
    try {
      const res = await api.get('/session/questions/');
      setQuestions(res.data);
    } catch (error) {
      setQuestions(null);
    }
  };
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
  useEffect(() => {
    setIdquestion(localStorage.getItem('questionID'));
    fetchQuestions();
  }, []);
  const json = {
    pages: [
      {
        // title: ask != null ? ask.title : '',
        elements: [
          {
            type: ask != null ? ask.typeToRender : '',
            name: 'answer',
            title: ask != null ? ask.title : '',
            isRequired: true,
            choices: ask != null ? ask.choices : '',
            correctAnswer: ask != null ? ask.correct_answer : ''
          }
        ]
      }
    ],
    completedHtml: `Vielen Dank für Deine Antwort`
  };
  const json1 = {
    pages: [
      {
        // title: ask != null ? ask.title : '',
        elements: [
          {
            type: questionData != null ? questionData.typeToRender : '',
            name: 'answer',
            title: questionData != null ? questionData.title : '',
            isRequired: true,
            choices: questionData != null ? questionData.choices : '',
            correctAnswer: questionData != null ? questionData.correct_answer : ''
          }
        ]
      }
    ],
    completedHtml: `Vielen Dank für Deine Antwort`
  };

  /**
   * The current survey getting displayed.
   */
  const survey = new Survey.Model(json1);
  survey.onComplete.add((sender) => {
    sendAnswer(questionData.id, sender.data.answer, questionData.typeToRender);
    socket.send(
      JSON.stringify({
        action: 'statisticChange',
        payload: questionData.id
      })
    );
    setAnswered(true);
    fetchStatistic();
    localStorage.removeItem('questionID');
  });

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
  
  /**
   * Data for the statistic.
   */ 
  const data = {
    labels,
    datasets: test
  };

  /**
   * View before answering the Survey.
   */  
  let BeforeAnswers = (
    <>
      {questionData != null ? (
        <Survey.Survey model={survey} completeText="Senden" />
      ) : (
        <span>
          <Spin />
        </span>
      )}
      {questionData != null ? <Bar options={options} data={data} /> : ''}
    </>
  );

  /**
   * View after answering the Survey.
   */  
  let AfterAnswers = (
    <>
      <p style={{ textAlign: 'center', width: '100%' }}>Vielen Dank für Deine Antwort</p>
      {questionData != null ? <Bar options={options} data={data} /> : ''}
    </>
  );

  return <>{answered === true ? AfterAnswers : BeforeAnswers}</>;
};

SurveyRep.propTypes = {};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { sendAnswer })(SurveyRep);
