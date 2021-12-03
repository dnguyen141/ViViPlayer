import React from 'react';
import PropTypes from 'prop-types';
import Video from '../../components/video/Video';
import UserStory from '../../components/user-story/UserStory';
import Vivilayout from '../../layout';
import Survey from '../../components/survey/Survey';
import { Row, Col } from 'antd';

function index(props) {
  return (
    <Vivilayout>
      <Row className="row-responsive">
        <Col
          className="col-responsive"
          span={12}
          style={{ padding: '25px', justifyContent: 'center' }}
        >
          <Video />
        </Col>
        <Col
          className="col-responsive"
          span={12}
          style={{ padding: '25px', justifyContent: 'center' }}
        >
            <UserStory />
            <Survey />
        </Col>
      </Row>
    </Vivilayout>
  );
}

index.propTypes = {};

export default index;
