import React from 'react';
import Vivilayout2 from '../../layout/index2';
import VideoEdit from '../../components/edit-video/VideoEdit';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

function index(props) {
  return (
    <Vivilayout2>
      <VideoEdit />
    </Vivilayout2>
  );
}

index.propTypes = {};

export default index;
