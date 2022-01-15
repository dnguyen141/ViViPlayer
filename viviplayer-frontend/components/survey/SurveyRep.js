import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Survey from 'survey-react';
import { WS_BACKEND } from '../../constants/constants';

let socket;

const SurveyRep = ({ askFromAdminState }) => {
  const [ask, setAsk] = useState(null);
  const [correctAns, setCorrectAns] = useState(null);
  useEffect(() => {
    setAsk(askFromAdminState);
    setCorrectAns(ask != null ? ask.correct_answer : '');
  }, [askFromAdminState]);
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'questionFromServer') {
        setAsk(data.payload);
      }
    };
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
    completedHtml: `Vielen Dank für Deine Antwort <br /> the correct answer is: <b>${correctAns}</b>`
  };
  const survey = new Survey.Model(json);
  survey.onComplete.add((sender) => {
    console.log(sender.data);
  });

  return <>{ask != null ? <Survey.Survey model={survey} completeText="Send" /> : ''}</>;
};

SurveyRep.propTypes = {};

export default SurveyRep;
