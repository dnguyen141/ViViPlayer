import React, { useState, useEffect } from 'react';
import Vivilayout from '../../layout/index';
import Router from 'next/router';
import api from '../../utils/api';
import SessionForm from '../../components/session/SessionForm';
import SessionTable from '../../components/session/SessionTable';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import { connect } from 'react-redux';
import { Col, Row, Divider } from 'antd';

/**
 * Creates the dashboard page where the user can create, edit and delete a session.
 * @param {*} param0 Props being passed to the function.
 * @returns UI to be rendered.
 */
const Dashboard = ({ user, loadUser, loading }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    } else {
      Router.push('/');
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    loadUser();

    // log user out from all tabs if they log out in one tab
    // window.addEventListener('storage', () => {
    //   if (!localStorage.token) {
    //     type: LOGOUT;
    //   }
    // });
  }, []);

  if (user && user.is_mod == false) {
    Router.push('/video');
  }

  /**
   * Updates the session state if something changed.
   */
  async function fetchSession() {
    const res = await api.get('/session/');
    setSessionData(res.data);
  }

  useEffect(() => {
    fetchSession();
  }, [updateTable, loading]);
  return (
    <Vivilayout>
      <Row className="row-responsive">
        <Col className="col-responsive" span={12} style={{ padding: '1em' }}>
          <h2>Session List</h2>
          <Divider />
          {sessionData != 0 ? (
            <SessionTable updateLayoutState={updateTable} updateLayout={setupdateTable} />
          ) : (
            <div style={{ paddingBottom: '50px' }}>Sie haben keine Session erstellt.</div>
          )}
        </Col>
        <Col className="col-responsive" span={12} style={{ padding: '1em' }}>
          <SessionForm updateLayoutState={updateTable} updateLayout={setupdateTable} />
        </Col>
      </Row>
    </Vivilayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.session.loading
});

export default connect(mapStateToProps, { loadUser })(Dashboard);
