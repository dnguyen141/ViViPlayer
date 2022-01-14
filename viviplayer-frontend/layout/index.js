import React, { useState, useEffect } from 'react';
import Router from 'next/router';
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
  const userDataGet = async () => {
    const userData = await api.get("/auth/user/");
    setIsMod(userData.data.is_mod);
    console.log(userData.data.is_mod)
  }

  let socket;
  console.log("IS MOD " + isMod);
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
        <Menu theme="dark" disabledOverflow="true" mode="horizontal" style={{ float: "left" }}>
          <Menu.Item key="1" className="text-white" onClick={() => Router.push('/dashboard')}>
            VIVIPLAYER3
          </Menu.Item>
           {isMod == true ? (
          <Menu.Item key="5" onClick={() => Router.push('/video-edit')}>
            Edit Video
          </Menu.Item>
           ) : (
             ""
           )}
          <Menu.Item key="2" onClick={() => Router.push('/video')}>
            Session
          </Menu.Item>
        </Menu>
        <Menu theme="dark" mode="horizontal" disabledOverflow="true" style={{ float: "right" }}>
          <Menu.Item key="3" onClick={() => Router.push('/video')}>
            {user != null ? <span className="text-white">Hello {user.username}</span> : 'hello'}
          </Menu.Item>
          {isMod == true ? (
            <Menu.Item
              key="4"
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
