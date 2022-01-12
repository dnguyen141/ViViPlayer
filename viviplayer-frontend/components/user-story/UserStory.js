import React, { useState } from 'react';
import { Card, Divider } from 'antd';
import PropTypes from 'prop-types';
import Satz from '../satz/Satz';
import UsrStoryDesire from './UsrStoryDesire';
import SurveyContainer from '../survey/SurveyContainer';

const tabList = [
  {
    key: 'tab1',
    tab: 'User Story'
  },
  {
    key: 'tab2',
    tab: 'Satz'
  }
];

const UserStory = (props) => {
  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const contentList = {
    tab1: (
      <Card style={{ border: '3px solid gray' }}>
        <UsrStoryDesire />
        <Divider />
        <SurveyContainer />
      </Card>
    ),
    tab2: (
      <Card style={{ border: '3px solid gray' }}>
        <Satz />
        <Divider />
        <SurveyContainer />
      </Card>
    )
  };

  return (
    <Card
      bordered={false}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={(key) => {
        onTab1Change(key);
      }}
    >
      {contentList[activeTabKey1]}
    </Card>
  );
};

UserStory.propTypes = {};

export default UserStory;
