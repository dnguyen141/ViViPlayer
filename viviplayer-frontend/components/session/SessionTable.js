import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Col, Table, Space, Popconfirm, Row } from 'antd';
import PropTypes from 'prop-types';
import EditSession from './EditSession';
import { getInfoSession } from '../../actions/session.action';
import { connect } from 'react-redux';

const SessionTable = ({ getInfoSession }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 }
  };
  async function fetchSession() {
    const res = await api.get('/session/');
    setSessionData(res.data);
  }
  useEffect(() => {
    fetchSession();
  }, [updateTable]);
  const updateState = () => {
    fetchSession();
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <>{id}</>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name) => <>{name}</>
    },
    {
      title: 'Tan',
      dataIndex: 'tan',
      render: (tan) => <>{tan}</>
    },
    {
      title: 'Video Path',
      dataIndex: 'video_path',
      render: (video_path) => <>{video_path}</>
    },
    ,
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <div>
          <Space size="middle">
            <div>
              <EditSession id={id} context={record} updateFunc={updateState} />
              <Popconfirm
                title="Löschen dieses Session ist nicht rückgängig zu machen. Weiter?"
                onConfirm={() => {}}
              >
                <a style={{ color: 'red' }}>Delete</a>
              </Popconfirm>
            </div>
          </Space>
        </div>
      )
    }
  ];

  return (
    <Row>
      <Col span={7} />
      <Col span={10}>
        <h3>Session List</h3>
        <Table columns={columns} pagination={false} dataSource={sessionData} scroll={{ y: 200 }} />
      </Col>
      <Col span={7} />
    </Row>
  );
};

SessionTable.propTypes = {};

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, { getInfoSession })(SessionTable);
