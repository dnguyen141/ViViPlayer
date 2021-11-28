import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Layout, Menu, Col } from 'antd';


const holder = {
  xs: { span: 24, offset: 0 },
  sm: { span: 22, offset: 1 },
  md: { span: 22, offset: 1 },
  lg: { span: 20, offset: 2 }
};

const Vivilayout = ({ children }) => {
  return (
    <Layout>
      <Layout.Header>
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
      <Layout.Content>
          <Col {...holder}>
          {children}
          </Col>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>Create by Viviplayer3 team</Layout.Footer>
    </Layout>
  );
};

Vivilayout.propTypes = {};

export default Vivilayout;
