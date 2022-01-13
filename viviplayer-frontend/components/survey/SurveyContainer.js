import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SurveyRep from './SurveyRep';
import SurveyCreate from './SurveyCreate';
import { createSurvey } from '../../actions/survey.action';
import { WS_BACKEND } from '../../constants/constants';

let socket;

function SurveyContainer({ user, createSurvey }) {
  const [askFromAdmin, setAskFromAdmin] = useState(null);
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'surveyChange') {
        console.log('survey change message',data.payload);
        setAskFromAdmin(data.payload);
      }
    };
  }, []);
  const updateState = (values) => {
    createSurvey(values.shot, values.title, values.choices, values.correct_answer, values.type);
    socket.send(
      JSON.stringify({
        action: 'surveyChange',
        time: 0,
        payload: values
      })
    );
  };

  let SurveyView = (
    <div>
      {user && user.is_mod ? (
        <SurveyCreate setAskFromAdminFunc={setAskFromAdmin} updateStateFunc={updateState} />
      ) : (
        <SurveyRep askFromAdminState={askFromAdmin} />
      )}
    </div>
  );
  return (
    <div>{askFromAdmin != null ? <SurveyRep askFromAdminState={askFromAdmin} /> : SurveyView}</div>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { createSurvey })(SurveyContainer);
