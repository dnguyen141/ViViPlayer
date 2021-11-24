import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';

const Vivilayout = ({ children }) => {
  return (
    <Layout>
      <Layout.Header>
        {/* <div className="logo">Logo there</div> */}
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" className="logo" onClick={() => Router.push('/dashboard')}>
            Viviplayer3
          </Menu.Item>
          <Menu.Item key="2" onClick={() => Router.push('/video')}>
            Video
          </Menu.Item>
          <Menu.Item key="3">Session</Menu.Item>
          <Menu.Item key="4">
          Test
          </Menu.Item >
          <Menu.Item key="5">
          Test 
          </Menu.Item>
          <Menu.Item key="6">
            Test
          </Menu.Item >
        </Menu>
      </Layout.Header>
      <Layout.Content className="site-layout">
        <div className="site-layout-background" >
          {children}
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>Create by Viviplayer3 team</Layout.Footer>
    </Layout>
  );
};

Vivilayout.propTypes = {};

export default Vivilayout;
