import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';

const Vivilayout = ({ children }) => {
  return (
    <Layout>
      <Layout.Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        {/* <div className="logo">Logo there</div> */}
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" className="text-white" onClick={() => Router.push('/dashboard')}>
            VIVIPLAYER3
          </Menu.Item>
          <Menu.Item key="2" onClick={() => Router.push('/video')}>
            Video
          </Menu.Item>
          <Menu.Item key="3">Session</Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: '80vh' }}>
          {children}
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>Create by Viviplayer3 team</Layout.Footer>
    </Layout>
  );
};

Vivilayout.propTypes = {};

export default Vivilayout;
