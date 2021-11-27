import React, { useState } from 'react';
import { Form, Card, Input, Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';
import Vivilayout from '../../layout/index';
import styles from './user-story.module.css';

const { TextArea } = Input;
const tabList = [
  {
    key: 'tab1',
    tab: 'User Story'
  },
  {
    key: 'tab2', //This should be used for function description for both User Story and Kommentar
    tab: 'Satz'
  },
  {
    key: 'tab3',
    tab: 'Kommentar'
  }
];

const UserStory = (props) => {
  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const contentList = {
    tab1: (
      <Card title="User Story" style={{width:'500px', height:'280px', border:'3px solid gray'}}>
        <b>Geben Sie ihre User Story ein.</b>
        <Form form={form} name="control-hooks" style={{ padding: '10px' }}>
          <Form.Item name="label">
            <p>
              Damit
              <Input className={styles.inputuser} />
            </p>
            <p>
              möchte ich als
              <Input className={styles.inputuser} />
            </p>
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ margin: '5px', fontSize: '14px' }} htmlType="submit">
              Posten
            </Button>
            <Button htmlType="button" style={{ margin: '5px', fontSize: '14px' }} onClick={onReset}>
              Zurücksetzen
            </Button>
          </Form.Item>
        </Form>
      </Card>
    ),
    tab2: 'This is the Description for User Story and Kommentar.',
    tab3: (
      <Card title="Kommentar" style={{width:'500px', height:'280px', border:'3px solid gray'}}>
        <b>Geben Sie ihren Kommentar ein.</b>
        <Form form={form} name="control-hooks" style={{ padding: '5px' }}>
          <Form.Item name="label">
            <TextArea rows={3} style={{paddingTop:'13px'}}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ margin: '5px', fontSize: '14px' }} htmlType="submit">
              Posten
            </Button>
            <Button htmlType="button" style={{ margin: '5px', fontSize: '14px' }} onClick={onReset}>
              Zurücksetzen
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  };

  return (
    <Vivilayout>
      <Row>
        <Col span={12}>
          <h1 style={{marginLeft: '250px', marginTop: '250px'}}>This is for the Video Player.</h1>
        </Col>
        <Col span={12}>
            <Card
              style={{ width: '90%', paddingLeft: '250px' }}
              bordered={false}
              tabList={tabList}
              activeTabKey={activeTabKey1}
              onTabChange={(key) => {
                onTab1Change(key);
              }}
            >
              {contentList[activeTabKey1]}
            </Card>
            <br />
            <br />
        </Col>
      </Row>
    </Vivilayout>
  );
};

UserStory.propTypes = {};

export default UserStory;
