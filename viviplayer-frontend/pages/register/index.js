import React from 'react'
import Router from 'next/router';
import PropTypes from 'prop-types'
import RegisterForm from '../../components/register-form/RegisterForm';
import { Layout, Menu } from 'antd';

function index(props) {
    return (
        <Layout>
        <Layout.Header style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* <div className="logo">Logo there</div> */}
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1" className="text-white" onClick={() => Router.push('/dashboard')}>
            VIVIPLAYER3
          </Menu.Item>
          <Menu.Item key="2" onClick={() => Router.push('/')} style={{marginLeft: 'auto'}}>
            Zurück zur Hauptseite
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: '80vh' }}>
          <RegisterForm />
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>Created by Viviplayer3 team</Layout.Footer>
        </Layout>
    )
}

index.propTypes = {

}

export default index

