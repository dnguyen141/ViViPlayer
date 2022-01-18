import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'antd';
import PropTypes from 'prop-types';
import Satz from '../satz/Satz';
import UsrStoryDesire from './UsrStoryDesire';
import SurveyContainer from '../survey/SurveyContainer';
import { VIDEO_PREFIX, WS_BACKEND } from '../../constants/constants';

/**
 * Socket for updates between users.
 */
let socket;

/**
 * Tabs that are displayed on the /video site.
 */
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


/**
 * Displays the three different tabs.
 * @param {*} param0 Props being passed to the function.
 * @returns Interface to be rendered.
 */
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

  /**
   * Updates the current active tab key to the right value.
   * @param {string} key The key of the tab that is now active.
   */
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

   /**
   * Defines the content of the tabs. 
   */    
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
        <SurveyContainer currentShot={currentShot}/>
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
