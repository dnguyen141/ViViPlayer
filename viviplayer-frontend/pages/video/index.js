import React from 'react';
import PropTypes from 'prop-types';
import Video from '../../components/video/Video';
import UserStory from '../../components/user-story/UserStory';
import Vivilayout from '../../layout';

function index(props) {
  return (
    <Vivilayout>
      <Video />
      <UserStory />
    </Vivilayout>
  );
}

index.propTypes = {};

export default index;
