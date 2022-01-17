import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { logout } from '../actions/auth.action';
import { connect } from 'react-redux';

const Vivilayout2 = ({ children, logout, user }) => {
  return (
    <Layout>
      <Layout.Header style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* <div className="logo">Logo there</div> */}
        <Menu className="vivi-layout" theme="dark" disabledOverflow="true" mode="horizontal" style={{ float: "left" }}>
          <Menu.Item key="1" className="text-white vivi-menu-button" onClick={() => Router.push('/dashboard')}>
            VIVIPLAYER3
          </Menu.Item>
          <Menu.Item className="vivi-menu-button" key="5" onClick={() => Router.push('/video-edit')}>
            Edit Video
          </Menu.Item>
          <Menu.Item className="vivi-menu-button" key="2" onClick={() => Router.push('/video')}>
            Session
          </Menu.Item>
        </Menu>
        <Menu className="vivi-layout" theme="dark" mode="horizontal" disabledOverflow="true" style={{ float: "right" }}>
          <Menu.Item className="vivi-menu-button" key="3" onClick={() => Router.push('/video')}>
            {user != null ? <span className="text-white">Hello {user.username}</span> : 'hello'}
          </Menu.Item>
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

Vivilayout2.propTypes = {};
const mapStateToProps = (state) => ({
  user: state.auth.user
});
export default connect(mapStateToProps, { logout })(Vivilayout2);
