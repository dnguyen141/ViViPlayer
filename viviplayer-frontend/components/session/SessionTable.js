import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Divider, Table, Space, Popconfirm, Typography } from 'antd';
import PropTypes from 'prop-types';
import EditSession from './EditSession';
import { setAuthToken } from '../../utils/setAuthToken';
import { deleteSessionById } from '../../actions/session.action';
import { loadUser } from '../../actions/auth.action';
import { connect } from 'react-redux';
import { WS_BACKEND } from '../../constants/constants';
let socket;
const { Paragraph } = Typography;
const SessionTable = ({ deleteSessionById, updateLayout, updateLayoutState, loading }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    } else {
      Router.push('/');
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    loadUser();

    // log user out from all tabs if they log out in one tab
    // window.addEventListener('storage', () => {
    //   if (!localStorage.token) {
    //     type: LOGOUT;
    //   }
    // });
  }, []);
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 }
  };
  // connect to socket and update sentence table
  useEffect(() => {
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socket = new WebSocket(url);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.action === 'updateSession') {
        fetchSession();
      }
    };
  }, []);

  async function fetchSession() {
    const res = await api.get('/session/');
    setSessionData(res.data);
  }
  useEffect(() => {
    fetchSession();
  }, [updateTable, loading]);
  const updateState = () => {
    fetchSession();
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      render: (id) => <p><b>{id}</b></p>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
      render: (name) => <Paragraph copyable>{name}</Paragraph>
    },
    {
      title: 'Tan',
      dataIndex: 'tan',
      render: (tan) => <Paragraph copyable>{tan}</Paragraph>
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
            <EditSession id={id} context={record} updateFunc={updateState} />
            <Popconfirm
              title="Löschen dieses Session ist nicht rückgängig zu machen. Weiter?"
              onConfirm={() => {
                deleteSessionById(id);
                updateState();
                setupdateTable(!updateTable);
                updateLayout(!updateLayoutState);
              }}
            >
              <a style={{ color: 'red' }}>Delete</a>
            </Popconfirm>
          </Space>
        </div>
      )
    }
  ];

  return (
    <div>
      <Table columns={columns} pagination={false} dataSource={sessionData} scroll={{ y: 200 }} />
    </div>
  );
};

SessionTable.propTypes = {};

const mapStateToProps = (state) => ({
  loading: state.session.loading
});
export default connect(mapStateToProps, { deleteSessionById })(SessionTable);
