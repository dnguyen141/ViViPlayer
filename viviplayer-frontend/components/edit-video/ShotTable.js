import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Divider, Table, Space, Popconfirm, Typography } from 'antd';
import PropTypes from 'prop-types';
import { setAuthToken } from '../../utils/setAuthToken';
import { deleteShotById } from '../../actions/session.action';
import { loadUser } from '../../actions/auth.action';
import { connect } from 'react-redux';
import { WS_BACKEND } from '../../constants/constants';
import EditShot from './EditShot';
let socket;

const ShotTable = ({ deleteShotById, loading }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [shotData, setShotData] = useState(null);
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
      if (data.action === 'updateShot') {
        fetchShots();
      }
    };
  }, []);

  async function fetchShots() {
    const res = await api.get('/session/shots');
    setShotData(res.data);
  }
  useEffect(() => {
    fetchShots();
  }, [updateTable, loading]);
  const updateState = () => {
    fetchShots();
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      render: (id) => <p><b>{id}</b></p>
    },
    {
      title: 'Time',
      dataIndex: 'time',
      width: '30%',
      render: (time) => <p>{time}</p>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title) => <p>{title}</p>
    },
    {
      title: 'Image Path',
      dataIndex: 'img_path',
      render: (img_path) => <>{img_path}</>
    },
    ,
    {
      title: 'Aktionen',
      dataIndex: 'id',
      render: (id, record) => (
        <div>
          <Space size="middle">
            <EditShot id={id} context={record} updateFunc={updateState} />
            <Popconfirm
              title="Löschen dieser Session ist nicht rückgängig zu machen. Weiter?"
              onConfirm={() => {
                deleteShotById(id);
                updateState();
                setupdateTable(!updateTable);
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
      <Table columns={columns} pagination={false} dataSource={shotData} scroll={{ y: 300 }} />
    </div>
  );
};

ShotTable.propTypes = {};

const mapStateToProps = (state) => ({
  shots: state.session.shots
});
export default connect(mapStateToProps, { deleteShotById })(ShotTable);
