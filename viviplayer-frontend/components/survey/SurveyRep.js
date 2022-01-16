import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Survey from 'survey-react';
import { WS_BACKEND } from '../../constants/constants';
import { sendAnswer } from '../../actions/survey.action';

let socket;

const SurveyRep = ({ sendAnswer }) => {
  const [ask, setAsk] = useState(null);

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
    completedHtml: `Vielen Dank für Deine Antwort`
  };
  const survey = new Survey.Model(json);
  survey.onComplete.add((sender) => {
    sendAnswer(ask.id, sender.data.answer, ask.typeToRender);
    socket.send(
      JSON.stringify({
        action: 'statisticChange',
        payload: ask.id
      })
    );
  });

  return (
    <>
      {ask != null ? (
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
