import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { logout } from '../actions/auth.action';
import { connect } from 'react-redux';

const Vivilayout = ({ children, logout, user }) => {
  console.log(user);
  return (
    <Layout>
      <Layout.Header style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* <div className="logo">Logo there</div> */}
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" className="text-white" onClick={() => Router.push('/dashboard')}>
            VIVIPLAYER3
          </Menu.Item>
          <Menu.Item key="2" onClick={() => Router.push('/video')}>
            Session
          </Menu.Item>
          <Menu.Item key="3" style={{ marginLeft: 'auto' }} onClick={() => Router.push('/video')}>
            {user != null ? <span className="text-white">Hello {user.username}</span> : 'hello'}
          </Menu.Item>
          <Menu.Item
            key="4"
            style={{ display: 'flex' }}
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
