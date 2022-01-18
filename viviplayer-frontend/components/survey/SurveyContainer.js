import React from 'react';
import { connect } from 'react-redux';
import SurveyRep from './SurveyRep';
import SurveyCreate from './SurveyCreate';
import SurveyTable from './SurveyTable';
import { createSurvey } from '../../actions/survey.action';

/**
 * Displays an user interface to add, edit and delete surveys.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
function SurveyContainer({ user, currentShot}) {
  let SurveyView = (
    <div>
      {user && user.is_mod ? (
        <>
          <SurveyTable /> <SurveyCreate currentShot={currentShot}/>
        </>
      ) : (
        <SurveyRep />
      )}
    </div>
  );
  return <div>{user && user.is_mod == false ? <SurveyRep /> : SurveyView}</div>;
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { createSurvey })(SurveyContainer);
