import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { Comment, Form, Button, List, Input} from 'antd';
import moment from 'moment';
import styles from './user-story.module.css';

function UsrStory(props) {
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value1, setValue1] = useState(''); //value1 for the first text box
    const [value2, setValue2] = useState(''); //value2 for the second text box
    const CommentList = ({ comments }) => (
        <List
            dataSource={comments}
            itemLayout="horizontal"
            renderItem={(props) => <Comment {...props} />}
            className="scroll-bar"
        />
    );

    const handleSubmit = () => {
        if (!value1 || !value2) {
            console.log('run there');
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setValue1('');
            setValue2('');
            setComments([
                ...comments,
                {
                    author: 'User',
                    avatar: 'https://joeschmoe.io/api/v1/random',
                    content: <p>[N-th Shot]-[Titel des Shots] : Damit ich {value1}, möchte ich als {value2}</p>,
                    datetime: moment().fromNow()
                }
            ]);
            console.log(comments);
        }, 1000);
    };

    const onReset = () => {
        setValue1('');
        setValue2('');
      };
    
    return (
        <>
            {comments != undefined && <CommentList comments={comments} />}
            <Comment
                content={
                    <>
                        <Form style={{ padding: '5px' }}>
                            <Form.Item name="label">
                                <div>
                                    <div style={{ paddingTop: '0.4em' }}>Damit</div>
                                    <div>
                                        <Input className={styles.inputuser} value={value1} onChange={(e) => setValue1(e.target.value)}/>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ paddingTop: '0.4em' }}>möchte ich als</div>
                                    <div>
                                        <Input className={styles.inputuser} value={value2} onChange={(e) => setValue2(e.target.value)}/>
                                    </div>
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" style={{ margin: '5px', fontSize: '14px', marginLeft: '0px' }} htmlType="submit" loading={submitting} onClick={handleSubmit}>
                                    Posten
                                </Button>
                                <Button htmlType="button" style={{ margin: '5px', fontSize: '14px' }} onClick={onReset}>
                                    Zurücksetzen
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }
            />
        </>
    )
}

UsrStory.propTypes = {

}

export default UsrStory

