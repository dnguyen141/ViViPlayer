import React, { useEffect } from 'react';
import Vivilayout from '../../layout/index';
import Router from 'next/router';
import SessionForm from '../../components/session/SessionForm';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import { connect } from 'react-redux';

const Dashboard = ({ user }) => {
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

  return (
    <Vivilayout>
      <SessionForm />
    </Vivilayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { loadUser })(Dashboard);
