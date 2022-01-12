import React, { useState, useEffect } from 'react';
import 'videojs-markers';
import videoJs from 'video.js';
import { Button, List, Input, Form, Table, Space, Popconfirm, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import styles from '../video/video.module.css';
import { getInfoSession, createShot } from '../../actions/session.action';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import { deleteShotById } from '../../actions/session.action';
import api from '../../utils/api';
import EditShot from './EditShot';
import { WS_BACKEND, VIDEO_PREFIX } from '../../constants/constants';

let socket;
// !!! markers need to be an Integer
const VideoEdit = ({ createShot, deleteShotById, loadUser, loading, user }) => {
  const [updateTable, setupdateTable] = useState(false);
  const [shotData, setShotData] = useState(null);
  const [userState, setUserState] = useState(null);
  const [form] = Form.useForm();
  const [session, setSession] = useState({
    name: 'dummy',
    tan: 'dummytan',
    video_path: ''
  });

  // const [session, setSession] = useState(null);
  useEffect(async () => {
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
    const res = await api.get('/session/');
    setSession(res.data[0]);
    // log user out from all tabs if they log out in one tab
    // window.addEventListener('storage', () => {
    //   if (!localStorage.token) {
    //     type: LOGOUT;
    //   }
    // });
  }, [loading]);
  // set user state
  useEffect(() => {
    if (user) {
      setUserState(user);
    }
  }, []);

  var markerListTemp = [];
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [player, setPlayer] = useState(null);
  const [progressBarWidth, setProgressBarWidth] = useState('100%');
  const [markerList, setMarkerList] = useState([]);
  const [markers, setMarkers] = useState(null);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [playPauseIcon, setPlayPauseIcon] = useState(
    <CaretRightOutlined style={{ fontSize: '150%' }} />
  );
  const [autoStop, setAutoStop] = useState(false);
  const [chapterText, setChapterText] = useState('');
  const [lastTime, setLastTime] = useState(0);
  const [visibleChapterText, setVisibleChapterText] = useState('translateY(-100%)'); // -100% = disappear, 0 = appear

  const insertArray = async () => {
    //create and update list of shots
    var markerListTemp = [];
    const shotsData = await api.get('/session/shots/');
    for (let i = 0; i < shotsData.data.length; i++) {
      markerListTemp.push({
        time: shotsData.data[i]['time'],
        text: shotsData.data[i]['title']
      });
    }

    setMarkerList(markerListTemp);
  };

  //maps the markers of the markersList to individual <div> elements that then get drawn on the progressbar. every change of the markerList should also rerender the
  // markers. if not markers has to be an state too.
  function calculateMarkerPosition() {
    if (videoRef.current.readyState < 1) {
      setTimeout(calculateMarkerPosition, 500);
      return;
    }

    // das war vor dem loop
    setMarkers(
      markerList.map((marker) => (
        <div
          title={marker.text}
          className={styles.markers}
          style={{ left: (marker.time / videoRef.current.duration) * 100 + '%' }}
        />
      ))
    );
  }

  //plays and pauses the video and switches between the right icons for the state of the player.
  function togglePlayPause() {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlayPauseIcon(<PauseOutlined style={{ fontSize: '150%' }} />);
    } else {
      videoRef.current.pause();
      setPlayPauseIcon(<CaretRightOutlined style={{ fontSize: '150%' }} />);
    }
  }

  //switches the AutoStop value to the opposite.
  function toggleautoStop() {
    setAutoStop(!autoStop);
  }

  //The function updates the all visual elements of the player. It stops the the player when the autostop mode is selected when a shot is reached
  // and displays the current chapter title. It also manages the current time and the progressbar.
  function updatePlayer() {
    // if it finds a marker at that spot it will pause the video and display the chapter text. the bigger time gap is necessary because the execution time isnt predictable and it will cause the player to skip the marker.
    var temp = markerList.find(
      (x) => videoRef.current.currentTime >= x.time && videoRef.current.currentTime <= x.time + 1
    );

    if (temp != null) {
      setVisibleChapterText('translateY(0%)');
      setLastTime(temp.time); //last marker that was found.
      setChapterText(temp.text);
      if (autoStop) {
        //when the player didnt already stop at this marker the player gets paused. this prevents multiple pauses at one marker and it doesnt get stuck
        if (videoRef.current.currentTime >= lastTime + 1) {
          videoRef.current.pause();
        }
      }
    } else if (lastTime !== 0) {
      setLastTime(-1); //resets the last chapter so that it can be played again.
    }

    requestAnimationFrame(() => {
      //checks whether the chapter title should still be shown
      if (lastTime === -1 || videoRef.current.currentTime > lastTime + 5) {
        setVisibleChapterText('translateY(-100%)');
      }

      //checks if the site has loaded all necessary data and if not rerun the function after 500ms.
      if (videoRef.current.readyState < 2) {
        setTimeout(updatePlayer, 500);
      }

      //toggles between the play and pause icons based on the current state of the player.
      if (videoRef.current.paused) {
        setPlayPauseIcon(<CaretRightOutlined style={{ fontSize: '150%' }} />);
      } else {
        setPlayPauseIcon(<PauseOutlined style={{ fontSize: '150%' }} />);
      }

      //the progressbar's position gets set based on the percentage the video has completed.
      var currentPosition = videoRef.current.currentTime / videoRef.current.duration;
      setProgressBarWidth(currentPosition * 100 + '%');

      //calculates the current time and the duration of the video in minutes and seconds and then brings in the right format.
      var currentMinutes = Math.floor(videoRef.current.currentTime / 60);
      var currentSeconds = Math.floor(videoRef.current.currentTime - currentMinutes * 60);

      if (currentSeconds < 10) {
        currentSeconds = '0' + currentSeconds;
      }
      setCurrentTime(currentMinutes + ':' + currentSeconds);

      var durationMinutes = Math.floor(videoRef.current.duration / 60);
      var durationSeconds = Math.floor(videoRef.current.duration - durationMinutes * 60);

      if (durationSeconds < 10) {
        durationSeconds = '0' + durationSeconds;
      }
      setDuration(durationMinutes + ':' + durationSeconds);
    });
  }

  const createShotFunc = ({ text }) => {
    //post the shot to the server
    var time = videoRef.current.currentTime;
    createShot(time, text);
    updateState();
    setupdateTable(!updateTable);
    form.resetFields();
  };

  function changeVideoPosition(e) {
    if (videoRef.current.readyState > 2) {
      //check if video is ready to be played

      //calculating the relative position of the click.
      var rect = e.currentTarget.getBoundingClientRect();
      var offsetX = e.clientX - rect.left;
      var newPosition = offsetX / e.currentTarget.clientWidth;

      //setting the values for the progressbar and the videotime
      setProgressBarWidth(newPosition * 100 + '%');
      videoRef.current.currentTime = newPosition * videoRef.current.duration;
    }
  }

  //run only one time after the first render.
  useEffect(() => {
    insertArray();
    calculateMarkerPosition();
    updatePlayer();
  }, []);

  //replaces the old markers with the new markers if the list changes
  useEffect(() => {
    calculateMarkerPosition(videoRef.current);
  }, [markerList]);

  useEffect(() => {
    if (videoRef.current != null) {
      setPlayer(videoRef.current);
    }
    if (!playerRef.current && videoRef.current != null) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videoJs(videoElement, () => {
        console.log('player is ready');
      }));
    }
    return () => {};
  }, [videoRef]);

  //===============================================================================
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
    insertArray();
  }, [updateTable, loading]);

  const updateState = () => {
    fetchShots();
    insertArray();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      render: (id) => (
        <p>
          <b>{id}</b>
        </p>
      )
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
    <>
      <Row className="row-responsive">
        <Col
          className="col-responsive"
          span={12}
          style={{ padding: '25px', justifyContent: 'center' }}
        >
          <div className={styles.videocontainer}>
            <div className={styles.videocontainer}>
              {session.name !== 'dummy' ? (
                <div key={session.tan}>
                  <h2> {session.name} </h2>
                  <video
                    // controls
                    // onProgress={(e) => pauseSegment(e)}
                    onTimeUpdate={updatePlayer}
                    ref={videoRef}
                    id="video-viviplayer"
                    //controls
                    preload="auto"
                    data-setup='{"fluid":true}' //This is used so that the video player is responsive
                    className="video-js vjs-default-skin vjs-big-play-centered"
                    onClick={togglePlayPause}
                  >
                    <source src={VIDEO_PREFIX + session.video_path} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div key={session.tan}>
                  <video
                    // onProgress={(e) => pauseSegment(e)}
                    onTimeUpdate={updatePlayer}
                    ref={videoRef}
                    id="video-viviplayer"
                    //controls
                    preload="auto"
                    data-setup='{"fluid":true}' //This is used so that the video player is responsive
                    className="video-js vjs-default-skin vjs-big-play-centered"
                    onClick={togglePlayPause}
                  >
                    <source src={VIDEO_PREFIX + session.video_path} type="video/mp4" />
                  </video>
                </div>
              )}
              <div
                className={styles.chapterinfocontainer}
                style={{ transform: visibleChapterText }}
              >
                <p className={styles.chapterinfo}> {chapterText}</p>
              </div>
              {user != null && user.is_mod == true ? (
                <div className={styles.controls}>
                  <div
                    className={styles.progressbarcontainer}
                    onClick={changeVideoPosition.bind(this)}
                  >
                    <div
                      className={styles.progressbar}
                      id="progressbar"
                      style={{ width: progressBarWidth }}
                    ></div>
                    {markers}
                  </div>

                  <div className={styles.buttons}>
                    <button id="play-pause-button" onClick={togglePlayPause}>
                      {playPauseIcon}
                    </button>
                  </div>
                  <input
                    type="range"
                    className={styles.volumeslider}
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="0.5"
                    onChange={(e) => (videoRef.current.volume = e.target.value)}
                  />
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={autoStop}
                    onChange={toggleautoStop}
                  />
                  <span className={styles.autostoptext}>Autostop</span>

                  <div className={styles.time}>
                    <span>{currentTime}</span> / <span>{duration}</span>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <Form form={form} onFinish={createShotFunc} style={{ paddingTop: '1em' }}>
            <div>Wählen Sie ein Shot aus dem Video, indem Sie an dem Progressbar klicken.</div>
            <Form.Item name="text">
              <Input placeholder="Geben Sie bitte Shottitel hier ein."></Input>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Shot Erstellen
            </Button>
          </Form>
        </Col>
        <Col
          className="col-responsive"
          span={12}
          style={{ padding: '25px', justifyContent: 'center' }}
        >
          <Table columns={columns} pagination={false} dataSource={shotData} scroll={{ y: 300 }} />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  sessionInfo: state.session.sessionInfo,
  user: state.auth.user,
  loading: state.session.loading
});

export default connect(mapStateToProps, { createShot, deleteShotById, getInfoSession, loadUser })(
  VideoEdit
);
