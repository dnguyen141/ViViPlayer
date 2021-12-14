import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Video from '../../components/video/Video';
import UserStory from '../../components/user-story/UserStory';
import Vivilayout from '../../layout';
import { Row, Col } from 'antd';
import setAuthToken from '../../utils/setAuthToken';
import { loadUser } from '../../actions/auth.action';
import { connect } from 'react-redux';

function Session({ isAuthenticated, loadUser }) {
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
        </Col>
      </Row>
    </Vivilayout>
  );
}

Session.propTypes = {};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loadUser })(Session);
