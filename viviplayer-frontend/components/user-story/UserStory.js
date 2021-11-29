import React, { useState } from 'react';
import { Form, Card, Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './user-story.module.css';

const { TextArea } = Input;
const tabList = [
  {
    key: 'tab1',
    tab: 'User Story'
  },
  {
    key: 'tab2',
    tab: 'Satz'
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
      <Card title="User Story" style={{ border: '3px solid gray' }}>
        <h4>Geben Sie ihre User Story ein.</h4>
        <Form form={form} name="control-hooks" style={{ padding: '5px' }}>
          <Form.Item name="label">
            <div>
              <div style={{ paddingTop: '0.4em' }}>Damit</div>
              <div>
                <Input className={styles.inputuser} />
              </div>
            </div>
            <div>
              <div style={{ paddingTop: '0.4em' }}>möchte ich als</div>
              <div>
                <Input className={styles.inputuser} />
              </div>
            </div>
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
    tab2: (
      <Card title="Kommentar" style={{ border: '3px solid gray' }}>
        <h4>Geben Sie ihren Kommentar ein.</h4>
        <Form form={form} name="control-hooks" style={{ padding: '5px' }}>
          <Form.Item name="label">
            <div>
              <div>
                <TextArea rows={5} style={{ paddingTop: '0.3em' }} />
              </div>
            </div>
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
    <Card
      bordered={false}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={(key) => {
        onTab1Change(key);
      }}
    >
      {contentList[activeTabKey1]}
    </Card>
  );
};

UserStory.propTypes = {};

export default UserStory;
