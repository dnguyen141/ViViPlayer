import React from 'react';
import PropTypes from 'prop-types';
import Video from '../../components/video/Video';
import UserStory from '../../components/user-story/UserStory';
import Vivilayout from '../../layout';
import { Row, Col } from 'antd';

function index(props) {
  return (
    <Vivilayout>
      <Row>
        <Col span={12}>
          <Video />
        </Col>
        <Col span={12}>
          <UserStory />
        </Col>
      </Row>
    </Vivilayout>
  );
}

index.propTypes = {};

export default index;
