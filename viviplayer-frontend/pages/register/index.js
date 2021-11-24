import {React, useState} from 'react';
import Vivilayout from '../../layout/index';
import { Layout, Row, Col, Form, Button, Input, Drawer, Menu, SubMenu } from "antd";




function Register(){

  const { Header, Footer, Content } = Layout;
  const layoutForm = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5, offset: 1},
      md: { span: 5},
      lg: { span: 5}
    },
    wrapperCol: {
      xs: { span: 8 },
      sm: { span: 8},
      md: { span: 8 },
      lg: { span: 8, offset: 0}
    }
  };
  
  const layoutReg = {
    xs: { span: 20, offset: 2 },
    sm: { span: 18, offset: 3 },
    md: { span: 18, offset: 3 },
    lg: { span: 14, offset: 5 }
  };
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const showDrawer = () => {
    setDrawerVisible(true);
  };
  
  const closeDrawer = () => {
    setDrawerVisible(false);
  };




  return (
    <Vivilayout>
    
    <Content>
      <div class="bg-image"></div>

      <div class="spacer"></div>
      <Row>
        <Col {...layoutReg}>
          <div class="reg">
            <div class="regHeader">
              Registrieren Sie sich als Moderator
            </div>
            <Form
              {...layoutForm}
              name="basic"
              initialValues={{
                remember: true
              }}
              autoComplete="off"
            >
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Eine E-Mail-Adresse ist erforderlich."
                  }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Passwort"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Ein Passwort ist erforderlich!"
                  },
                  {
                    min: 8,
                    message: "Passwort muss mindestens 8 Zeichen lang sein!"
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 6,
                  span: 24
                }}
              >
                <Button type="primary" htmlType="submit">
                  Registrieren
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      <div class="spacer"></div>
    </Content>
    </Vivilayout>

  );
};


export default Register;
