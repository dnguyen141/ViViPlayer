import React, { useEffect } from 'react';
import Vivilayout from '../../layout/index';
import { connect } from 'react-redux';
import { loadUser } from '../../actions/auth.action';
import Router from 'next/router';
import setAuthToken from '../../utils/setAuthToken';

const Dashboard = ({ isAuthenticated, loadUser }) => {
  // useEffect(() => {
  //   // check for token in LS when app first runs
  //   if (localStorage.token) {
  //     // if there is a token set axios headers for all requests
  //     setAuthToken(localStorage.token);
  //   }
  //   // try to fetch a user, if no token or invalid token we
  //   // will get a 401 response from our API
  //   loadUser();

  //   // log user out from all tabs if they log out in one tab
  //   window.addEventListener('storage', () => {
  //     if (!localStorage.token) {
  //       type: LOGOUT;
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    }
    loadUser();
    if (isAuthenticated == false) {
      Router.push('/');
    }
  }, []);

  return (
    <Vivilayout>
      <h3>Login succes you are now in dashboard</h3>
    </Vivilayout>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loadUser })(Dashboard);
