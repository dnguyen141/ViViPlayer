import React from 'react';
import PropTypes from 'prop-types';
import { Survey, Model } from 'survey-react';
const json = {
  title: 'VIVIPlayer 3 questions',
  showProgressBar: 'bottom',
  showTimerPanel: 'top',

  pages: [
    {
      questions: [
        {
          type: 'radiogroup',
          name: 'civilwar',
          title: 'When was the Civil War?',
          choices: ['1750-1800', '1800-1850', '1850-1900', '1900-1950', 'after 1950'],
          correctAnswer: '1850-1900'
        }
      ]
    },
    {
      title: 'What car are you driving?',
      questions: [
        {
          type: 'checkbox',
          hasOther: true,
          choices: ['Audi', 'BMW', 'VW', 'Toyota', 'Tesla']
        }
      ]
    },
    {
      title: 'What operating system do you use?',
      questions: [
        {
          type: 'checkbox',
          name: 'opSystem',
          title: 'OS',
          hasOther: true,
          isRequired: true,
          choices: ['Windows', 'Linux', 'Macintosh OSX']
        }
      ]
    },
    {
      title: 'What language(s) are you currently using?',
      questions: [
        {
          type: 'checkbox',
          name: 'langs',
          title: 'Please select from the list',
          colCount: 4,
          isRequired: true,
          choices: [
            'Javascript',
            'Java',
            'Python',
            'CSS',
            'PHP',
            'Ruby',
            'C++',
            'C',
            'Shell',
            'C#',
            'Objective-C',
            'R',
            'VimL',
            'Go',
            'Perl',
            'CoffeeScript',
            'TeX',
            'Swift',
            'Scala',
            'Emacs Lisp',
            'Haskell',
            'Lua',
            'Clojure',
            'Matlab',
            'Arduino',
            'Makefile',
            'Groovy',
            'Puppet',
            'Rust',
            'PowerShell'
          ]
        }
      ]
    },

    {
      title: 'Please enter your name and e-mail',
      questions: [
        { type: 'text', name: 'name', title: 'Name:' },
        { type: 'text', name: 'email', title: 'Your e-mail' }
      ]
    }
  ]
};
const Ask = (props) => {
  const survey = new Model(json);

  return (
    <div>
      <Survey model={survey} />
    </div>
  );
};

Ask.propTypes = {};

export default Ask;
