import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Form, Input, Tabs, Button, Checkbox, notification, Col, Layout } from 'antd';
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import Vivilayout from '../layout/index';
const { Header, Footer, Content } = Layout;


const layoutForm = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4},
    md: { span: 4},
    lg: { span: 4}
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8},
    md: { span: 8 },
    lg: { span: 6}
  }
};
const layoutFormTan = {
  wrapperCol: {
    xs: { span: 24 , offset: 0},
    sm: { span: 10, offset: 2},
    md: { span: 6 , offset: 2},
    lg: { span: 6, offset: 2}
  }
};


const layoutButtonTan = {
  wrapperCol: {
    xs: { offset: 0 },
    sm: { offset: 2 },
    md: { offset: 2 },
    lg: { offset: 2 }
  }
};

const layoutButton = {
  wrapperCol: {
    xs: { offset: 0 },
    sm: { offset: 4 },
    md: { offset: 4 },
    lg: { offset: 4 }
  }
};


const { TabPane } = Tabs;
export default function Home() {
  const onFinish = async (values) => {
    if (!values.username) {
      openNotification('Please input your username!');
    } else if (!values.password) {
      openNotification('Please input your password!');
    } else if (values.username !== 'admin') {
      openNotification('Your user name is not correct');
    } else if (values.password !== 'admin1234') {
      openNotification('Your password is not correct');
    } else {
      Router.push('/dashboard');
    }
  };
  const loginWithTan = (values) => {
    console.log('TAN VALUES', values.tan);
    if (values.tan !== '112021') {
      console.log('run here');
      openNotification('TAN is not correct!');
    } else {
      Router.push('/dashboard');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const openNotification = (noti) => {
    notification.open({
      message: 'Notification Login',
      description: noti,
      onClick: () => {
        console.log('Notification Clicked!');
      }
    });
  };
  function callback(key) {
    console.log(key);
  }
  return (
    <Vivilayout>
      <Content>


        
            <div className="content">

              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Login with TAN" key="1">
                  <Form name="TAN Login" onFinish={loginWithTan} autoComplete="off"
                  {...layoutFormTan}
                  >
                    <Form.Item style={{ marginBottom: '1em' }} name="tan">
                      <Input prefix={<NumberOutlined />} placeholder="TAN" />
                    </Form.Item>

                    <Form.Item {...layoutButtonTan}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="Login as Moderator" key="2">
                  <Form
                    {...layoutForm}
                    name="loginForm"
                    initialValues={{
                      remember: true
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item className="form-login-label" label="Username" name="username">
                      <Input />
                    </Form.Item>

                    <Form.Item className="form-login-label" label="Password" name="password">
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      {...layoutButton}
                      name="remember"
                      valuePropName="checked"
                    >
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item {...layoutButton}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
          </div>

      </Content>
    </Vivilayout>
  );
}
