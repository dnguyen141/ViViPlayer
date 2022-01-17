import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Survey from 'survey-react';
import api from '../../utils/api';
import { WS_BACKEND } from '../../constants/constants';
import { sendAnswer } from '../../actions/survey.action';
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

const SurveyRep = ({ sendAnswer }) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const [ask, setAsk] = useState(null);

  const [questions, setQuestions] = useState(null);
  const [idQuestion, setIdquestion] = useState(null);
  const [statistic, setStatistic] = useState(null);
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    if (questions != null && idQuestion != null) {
      setIdquestion(idQuestion);
      // fetchStatistic();
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
        localStorage.setItem('static', data.time);
        setIdquestion(data.payload.id);
        setAsk(data.payload);
      }
    };
  }, []);
  // const fetchStatistic = async () => {
  //   const res = await api.get(`/session/statistics/${idQuestion}/`);
  //   setStatistic(res.data);
  // };
  // console.log('statistic', statistic);
  const fetchQuestion = async () => {
    const res = await api.get(`/session/questions/${idQuestion}/`);
    setQuestionData(res.data);
  };
  console.log('questionByID', questionData);
  const fetchQuestions = async () => {
    const res = await api.get('/session/questions/');
    setQuestions(res.data);
  };
  console.log('Question Data:', questionData);
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
  const survey = new Survey.Model(json1);
  survey.onComplete.add((sender) => {
    sendAnswer(questionData.id, sender.data.answer, questionData.typeToRender);
    socket.send(
      JSON.stringify({
        action: 'statisticChange',
        payload: questionData.id
      })
    );
  });

  return (
    <>
      {questionData != null ? (
        <Survey.Survey model={survey} completeText="Send" />
      ) : (
        'Hier gibt es keine Umfrage'
      )}
    </>
  );
};

SurveyRep.propTypes = {};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { sendAnswer })(SurveyRep);
