import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as Survey from 'survey-react';

const SurveyRep = ({ askFromAdminState }) => {
  const [ask, setAsk] = useState(null);
  useEffect(() => {
    setAsk(askFromAdminState);
  }, [askFromAdminState]);
  const json = {
    pages: [
      {
        // title: ask != null ? ask.title : '',
        elements: [
          {
            type: ask != null ? ask.type : '',
            name: 'answer',
            title: ask != null ? ask.title : '',
            isRequired: true,
            choices: ask != null ? ask.answer : '',
            correctAnswer: ['green']
          }
        ]
      }
    ],
    completedHtml: 'Vielen Dank für Deine Antwort'
  };
  const survey = new Survey.Model(json);
  survey.onComplete.add((sender) => {
    console.log(sender.data);
  });

  return <>{ask != null ? <Survey.Survey model={survey} completeText="Send" /> : ''}</>;
};

SurveyRep.propTypes = {};

export default SurveyRep;
