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
    const [submitting, setSubmitting] = useState(false);
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };
    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };

    const onSwitch = () => {
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setActiveTabKey1('tab2')
        }, 2000); //to switch to the other tab
    }

    const contentList = {
        tab1: (
            <Card style={{ border: '3px solid gray' }}>
                <Question />
                <Button type="primary" loading={submitting} htmlType="submit" onClick={onSwitch}>
                    Posten
                </Button>
            </Card>
        ),
        tab2: (
            <Card style={{ border: '3px solid gray' }}>
                <p>Hier steht das Ergebnis.</p>
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

