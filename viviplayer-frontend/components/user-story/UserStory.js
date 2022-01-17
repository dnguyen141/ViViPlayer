import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'antd';
import PropTypes from 'prop-types';
import Satz from '../satz/Satz';
import UsrStoryDesire from './UsrStoryDesire';
import SurveyContainer from '../survey/SurveyContainer';
import { VIDEO_PREFIX, WS_BACKEND } from '../../constants/constants';
let socket;
const tabList = [
  {
    key: 'tab1',
    tab: 'User Story'
  },
  {
    key: 'tab2',
    tab: 'Satz'
  },
  {
    key: 'tab3',
    tab: 'Umfrage'
  }
];

const UserStory = ({ currentShot }) => {
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'questionFromServer') {
        localStorage.setItem('questionID', data.payload.id);
      }
    };
  }, []);
  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const contentList = {
    tab1: (
      <Card style={{ border: '3px solid gray' }}>
        <UsrStoryDesire currentShot={currentShot} />
      </Card>
    ),
    tab2: (
      <Card style={{ border: '3px solid gray' }}>
        <Satz currentShot={currentShot} />
      </Card>
    ),
    tab3: (
      <Card style={{ border: '3px solid gray' }}>
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
