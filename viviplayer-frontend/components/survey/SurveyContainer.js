import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SurveyRep from './SurveyRep';
import SurveyCreate from './SurveyCreate';
import { WS_BACKEND } from '../../constants/constants';

let socket;

function SurveyContainer({ user }) {
  const [askFromAdmin, setAskFromAdmin] = useState(null);
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      console.log('socket in survey', e);
      const data = JSON.parse(e.data);
      if (data.action === 'surveyChange') {
        console.log(data.time);
        setAskFromAdmin(data.time);
      }
    };
  }, []);
  const updateState = (values) => {
    socket.send(
      JSON.stringify({
        action: 'surveyChange',
        time: values
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
export default connect(mapStateToProps, {})(SurveyContainer);
