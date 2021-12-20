import React, { useState } from 'react'
import { Table, Input, Popconfirm, Form, Typography } from 'antd';
import PropTypes from 'prop-types'

function SessionList(props) {
    //create table elements
    let value = true;
    const originData = []
    for (let i = 1; i < 5; i++) {
        originData.push({
            key: i.toString(),
            name: `Projekt #${i}`,
            tan: `${i + 2}${i + 1}${i + 3}${i + 1}${i + 1}${i}${i}${i}${i + 2}${i + 3}${i}${i + 1}${i}${i}${i}${i}${i}${i + 1}${i}${i}`, //hard code for example only
            is_open: value.toString(),
        });
    }

    //create editable cell
    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputLength = dataIndex === 'tan' ? <Input maxLength={20} /> : <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputLength}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    //choose which editable fields allowed
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            tan: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    //delete row handler
    const handleDelete = (key) => {
        setData(data.filter((item) => item.key !== key));
    };

    const columns = [
        {
            title: 'Session Name',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: 'TAN',
            dataIndex: 'tan',
            editable: true,
        },
        {
            title: 'is_open',
            dataIndex: 'is_open',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div>
                        <a>Join</a>
                        <b> | </b>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <b> | </b>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </div>
                );
            },
        }
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <h4>Session List</h4>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    pagination={{
                        pageSize: 2
                    }}
                />
            </Form>
        </>
    )
}

SessionList.propTypes = {

}

export default SessionList

