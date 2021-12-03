import React, { useState } from 'react';
import { Form, Card, Input, Button } from 'antd';
import styles from '../user-story/user-story.module.css';
import Question from '../survey-question/Question';
import PropTypes from 'prop-types';

const tabList = [
    {
        key: 'tab1',
        tab: 'Um-/Verständnisfrage'
    },
    {
        key: 'tab2',
        tab: 'Ergebnis'
    }
];

function Survey(props) {
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
            <Card style={{ border: '3px solid gray' }}>
                <Question />
            </Card>
        ),
        tab2: (
            <Card style={{ border: '3px solid gray' }}>
                <p>This is for Survey Results</p>
            </Card>)
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
    )
}

Survey.propTypes = {

}

export default Survey

