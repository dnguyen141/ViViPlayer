import React from 'react';
import PropTypes from 'prop-types';
import Video from '../../components/video/Video';
import UserStory from '../../components/user-story/UserStory';
import Vivilayout from '../../layout';
import { Row, Col } from 'antd';

/**
 * Creates the video page.
 * @param {*} param0 Props being passed to the function.
 * @returns UI to be rendered.
 */
function index(props) {
  const [currentShot, setCurrentShot] = React.useState(1);
  return (
    <Vivilayout>
      <Row className="row-responsive">
        <Col
          className="col-responsive"
          span={12}
          style={{ padding: '25px', justifyContent: 'center' }}
        >
          <Video setCurrentShot={setCurrentShot} />
        </Col>
        <Col
          className="col-responsive"
          span={12}
          style={{ padding: '25px', justifyContent: 'center' }}
        >
          <UserStory currentShot={currentShot} />
        </Col>
      </Row>
    </Vivilayout>
  );
}

index.propTypes = {};

export default index;
