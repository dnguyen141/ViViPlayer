import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SurveyRep from './SurveyRep';
import SurveyCreate from './SurveyCreate';
import SurveyTable from './SurveyTable';
import { createSurvey } from '../../actions/survey.action';
// import { WS_BACKEND } from '../../constants/constants';

// let socket;

function SurveyContainer({ user }) {
  const [askFromAdmin, setAskFromAdmin] = useState(null);
  // connect to socket and update sentence table
  // useEffect(() => {
  //   const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
  //   socket = new WebSocket(url);
  //   socket.onmessage = (e) => {
  //     const data = JSON.parse(e.data);
  //     if (data.action === 'surveyChange') {
  //       console.log('survey change message', data.payload);
  //       setAskFromAdmin(data.payload);
  //     }
  //   };
  // }, []);
  // console.log(askFromAdmin);
  let SurveyView = <div>{user && user.is_mod ? <SurveyTable /> : <SurveyRep />}</div>;
  return <div>{askFromAdmin != null ? <SurveyRep /> : SurveyView}</div>;
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { createSurvey })(SurveyContainer);
