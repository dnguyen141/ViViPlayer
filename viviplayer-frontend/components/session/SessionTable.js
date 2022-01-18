import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Divider, Table, Space, Popconfirm, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import EditSession from './EditSession';
import { setAuthToken } from '../../utils/setAuthToken';
import { deleteSessionById } from '../../actions/session.action';
import { loadUser } from '../../actions/auth.action';
import { connect } from 'react-redux';
import { WS_BACKEND, SERVER_BACKEND } from '../../constants/constants';

/**
 * Socket for updates between users.
 */
let socket;

const { Paragraph } = Typography;


/**
 * Displays a table for the current session.
 * @param {*} param0 Props being passed to the function.
 * @returns Table to be rendered.
 */
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

  }, []);
 
  

  //to export the data


  /**
   * Export the current User Stories into a .csv file and download it.
   */  
  const exportCSV = async () =>{
    
    api.request({
        url: "session/export/csv",
        responseType: "blob",
        method: "GET"
    
    }).then(({ data }) => {
    

        const downloadUrl = window.URL.createObjectURL(new Blob([data]));

        const link = document.createElement('a');

        link.href = downloadUrl;

        link.setAttribute('download', 'export.zip'); //any other extension

        document.body.appendChild(link);

        link.click();

        link.remove();
    });
  }
   /**
   * Export the current User Stories into a .odt file and download it.
   */
   const exportODT = async () =>{
    //const res = await api.get('/session/export/csv');

    api.request({
        url: "session/export/odt",
        responseType: "blob",
        method: "GET"
    
    }).then(({ data }) => {
    

        const downloadUrl = window.URL.createObjectURL(new Blob([data]));

        const link = document.createElement('a');

        link.href = downloadUrl;

        link.setAttribute('download', "export.odt"); //any other extension

        document.body.appendChild(link);

        link.click();

        link.remove();
    });
  }

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

  /**
   * Update sessionData state when something changes.
   */  
  async function fetchSession() {
    const res = await api.get('/session/');
    setSessionData(res.data);
  }
  useEffect(() => {
    fetchSession();
  }, [updateTable, loading]);

  /**
   * Updates the state of the session.
   */
  const updateState = () => {
    fetchSession();
  };
  
   /**
   * Defines the columns of the sessiontable.
   */  
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
              title="Löschen dieser Session ist nicht rückgängig zu machen. Weiter?"
              onConfirm={() => {
                deleteSessionById(id);
                updateState();
                setupdateTable(!updateTable);
                updateLayout(!updateLayoutState);
              }}
            >
              <a style={{ color: 'red' }}>Löschen</a>
            </Popconfirm>
          </Space>
        </div>
      )
    }
  ];

  return (
    <div>
      <Table columns={columns} pagination={false} dataSource={sessionData} scroll={{ y: 200 }} />
      <Button className="csv-button" style={{marginRight : '1em', marginTop: '0.5em'}} onClick={exportCSV}>Download .csv</Button>
      <Button style={{marginTop: '0.5em'}} onClick={exportODT}>Download .odt</Button>
    </div>
  );
};

SessionTable.propTypes = {};

const mapStateToProps = (state) => ({
  loading: state.session.loading
});
export default connect(mapStateToProps, { deleteSessionById })(SessionTable);
