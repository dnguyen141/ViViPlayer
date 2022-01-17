import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { logout } from '../actions/auth.action';
import { connect } from 'react-redux';
import { loadUser } from '../actions/auth.action';
import api from '../utils/api';
import { setAuthToken } from '../utils/setAuthToken';
import { WS_BACKEND, VIDEO_PREFIX } from '../constants/constants';

const Vivilayout = ({ children, logout, user }) => {
  const [isMod, setIsMod] = useState(false);
  const router = useRouter();
  const pathName = router.pathname;
  const userDataGet = async () => {
    const userData = await api.get("/auth/user/");
    setIsMod(userData.data.is_mod);
  }

  let socket;
  const socketRef = React.useRef(null);
  useEffect(async () => {
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    } else {
      Router.push('/');
    }
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socketRef.current = new WebSocket(url);
    userDataGet();
  }, []);
  return (
    <Layout>
      <Layout.Header style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* <div className="logo">Logo there</div> */}
        <Menu className="vivi-layout" theme="dark" disabledOverflow="true" mode="horizontal" style={{ float: "left" }}>
          <Menu.Item key="1" className="text-white vivi-menu-button" onClick={() => Router.push('/dashboard')}>
            VIVIPLAYER3
          </Menu.Item>
          {isMod == true ? (
            <Menu.Item className="vivi-menu-button" key="5" onClick={() => Router.push('/video-edit')}>
              Video bearbeiten
            </Menu.Item>
          ) : (
            ""
          )}
          <Menu.Item className="vivi-menu-button" key="2" onClick={() => Router.push('/video')}>
            Session
          </Menu.Item>
        </Menu>
        <Menu className="vivi-layout" theme="dark" mode="horizontal" disabledOverflow="true" style={{ float: "right" }}>
          <Menu.Item className="vivi-menu-button" key="3" onClick={() => Router.push('/video')}>
            {user != null ? <span className="text-white">Hallo {user.username}</span> : 'Hallo'}
          </Menu.Item>
          {(isMod == true && pathName === '/video') ? (
            <Menu.Item
              key="4"
              className="session-end vivi-menu-button"
              style={{color: 'rgb(199, 12, 12)'}}
              onClick={(e) => (
                socketRef.current.send(JSON.stringify({
                  'action': 'end',
                  'time': 0
                }))
              )}
            >
              Session Beenden
            </Menu.Item>
          ) : (
            ""
          )}
          <Menu.Item
            className="vivi-menu-button"
            key="6"
            onClick={() => {
              logout();
              Router.push('/');
            }}
          >
            Log Out
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: '80vh' }}>
          {children}
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>Created by Viviplayer3 team</Layout.Footer>
    </Layout>
  );
};

Vivilayout.propTypes = {};
const mapStateToProps = (state) => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { logout })(Vivilayout);
