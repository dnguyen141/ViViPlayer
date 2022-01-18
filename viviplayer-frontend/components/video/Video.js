import React, { useState, useEffect } from 'react';
import 'videojs-markers';
import Router from 'next/router';
import videoJs from 'video.js';
import { Button, List, Input, Form } from 'antd';
import { logout } from '../../actions/auth.action';
import { connect } from 'react-redux';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import styles from './video.module.css';
import { getInfoSession, createShot } from '../../actions/session.action';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import api from '../../utils/api';
import { WS_BACKEND, VIDEO_PREFIX } from '../../constants/constants';

/**
 * Displays the controls of the player and the markers.
 * @param {*} param0 Props being passed to the function.
 * @returns UI to be rendered.
 */
const Video = ({ loadUser, loading, user, logout, setCurrentShot }) => {
  const [userState, setUserState] = useState(null);
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
    fetchSession();
    // log user out from all tabs if they log out in one tab
    // window.addEventListener('storage', () => {
    //   if (!localStorage.token) {
    //     type: LOGOUT;
    //   }
    // });
  }, []);
  // set user state
  useEffect(() => {
    if (user) {
      setUserState(user);
    }
  }, []);

  const fetchSession = async () => {
    try {
      const res = await api.get('/session/');
      setSession(res.data[0]);
      console.log(session);
    } catch (error) {
      console.log(error);
      setSession(
        ...session,
        (video_path =
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')
      );
    }
  };

  /**
   * Reference to the current video.
   */
  const videoRef = React.useRef(null);

  /**
   * The current video.
   */
  const playerRef = React.useRef(null);
  const socketRef = React.useRef(null);
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
  const [lastTime, setLastTime] = useState(0); //used for calculating autostop
  const [visibleChapterText, setVisibleChapterText] = useState('hidden'); // -100% = disappear, 0 = appear
  //const [shotsData, setShotsData] = useState(null);

  /**
   * Inserting the shots received by the api and inserting them into the markerList- 
   */   
  const insertArray = async () => {
    var markerListTemp = [];
    // if(markerList == null)
    const shotsData = await api.get('/session/shots/');
    if (shotsData) {
      for (let i = 0; i < shotsData.data.length; i++) {
        markerListTemp.push({
          time: shotsData.data[i]['time'],
          text: shotsData.data[i]['title']
        });
      }
    }
    setCurrentShot(shotsData.data[0].id);
    setMarkerList(markerListTemp);
  };

  /**
  * Maps the markers in the markersList to individual div elements representing the shots.
  */
  function calculateMarkerPosition() {
    
    if (videoRef != null) {
      if (videoRef.current.readyState < 1) {
        setTimeout(calculateMarkerPosition, 500);
        return;
      }
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

   /**
   * Toggles between play and pause for everyone. It also changes the picture of the play button.
   */
  function togglePlayPause() {
    if (videoRef != null && videoRef.current.paused) {
      videoRef.current.play();
      setPlayPauseIcon(<PauseOutlined style={{ fontSize: '150%' }} />);

      socketRef.current.send(
        JSON.stringify({
          action: 'play',
          time: videoRef.current.currentTime
        })
      );
    } else {
      videoRef.current.pause();
      setPlayPauseIcon(<CaretRightOutlined style={{ fontSize: '150%' }} />);

      socketRef.current.send(
        JSON.stringify({
          action: 'pause',
          time: videoRef.current.currentTime
        })
      );
    }
  }

   /**
   * Switches on or off the autostop feature.
   */
  function toggleautoStop() {
    setAutoStop(!autoStop);
  }

  /**
  * Updates all visual elements of the player and also manages the autoplay functionality for everyone.
  */
  async function updatePlayer() {
    // if it finds a marker at that spot it will pause the video and display the chapter text. the bigger time gap is necessary because the execution time isnt predictable and it will cause the player to skip the marker.
    var temp;

    if (videoRef != null && temp != null) {
      temp = markerList.find(
        (x) => videoRef.current.currentTime >= x.time && videoRef.current.currentTime <= x.time + 1
      );
      setVisibleChapterText('visible');
      setLastTime(temp.time); //last marker that was found.
      setChapterText(temp.text);
      const shotsData = await api.get('/session/shots/');
      if (shotsData) {
        for (let i = 0; i < shotsData.data.length; i++) {
          if (shotsData.data[i]['time'] == temp.time) {
            setCurrentShot(shotsData.data[i]['id']);
            break;
          }
        }
      }

      if (autoStop) {
        //when the player didnt already stop at this marker the player gets paused. this prevents multiple pauses at one marker and it doesnt get stuck
        if (videoRef != null && videoRef.current.currentTime >= lastTime + 1) {
          videoRef.current.pause();
          socketRef.current.send(
            JSON.stringify({
              action: 'pause',
              time: temp.time
            })
          );
        }
      }
    } else if (lastTime !== 0) {
      setLastTime(-1); //resets the last chapter so that it can be played again.
    }

    requestAnimationFrame(() => {
      //checks whether the chapter title should still be shown
      if (lastTime === -1 || videoRef.current.currentTime > lastTime + 5) {
        setVisibleChapterText('hidden');
      }

      //checks if the site has loaded all necessary data and if not rerun the function after 500ms.
      if (videoRef != null && videoRef.current.readyState < 2) {
        setTimeout(updatePlayer, 500);
      }

      //toggles between the play and pause icons based on the current state of the player.
      if (videoRef != null && videoRef.current.paused) {
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

  /**
   * Changes to the corresponding chapter when clicking the button of the shot.
   * @param {Event} e Event when clicking on one of the buttons in the list.
  */   
  function handleListClick(e) {
    if (videoRef != null && videoRef.current.readyState > 2) {
      //check if video is ready to be played
      var text = e.target.innerHTML.toString();
      if (text != null) {
        var currentMarker = markerList.find((x) => x.text === text);
        console.log(currentMarker);
        if (currentMarker != null) {
          var newPosition = currentMarker.time / videoRef.current.duration;
          setProgressBarWidth(newPosition * 100 + '%');
          videoRef.current.currentTime = currentMarker.time;
          videoRef.current.pause();
          socketRef.current.send(
            JSON.stringify({
              action: 'pause',
              time: videoRef.current.currentTime
            })
          );
        }
      }
    }
  }

  /**
    * Changes the video position of the player and the progressbar.
    * @param {Event} e Event when clicked on the progressbar.
    */ 
  function changeVideoPosition(e) {
    if (user.is_mod) {
      if (videoRef != null && videoRef.current.readyState > 2) {
        //check if video is ready to be played

        //calculating the relative position of the click.
        var rect = e.currentTarget.getBoundingClientRect();
        var offsetX = e.clientX - rect.left;
        var newPosition = offsetX / e.currentTarget.clientWidth;

        //setting the values for the progressbar and the videotime
        setProgressBarWidth(newPosition * 100 + '%');
        videoRef.current.currentTime = newPosition * videoRef.current.duration;

        socketRef.current.send(
          JSON.stringify({
            action: 'skip',
            time: videoRef.current.currentTime
          })
        );
      }
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
    const url = (WS_BACKEND || 'ws://' + window.location.host) + '/ws/player/sessionid12345/';
    socketRef.current = new WebSocket(url);
    const socket = socketRef.current;

    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data.action === 'play') {
        if (videoRef != null && videoRef.current) {
          videoRef.current.play();
          videoRef.current.currentTime = data.time + '';
        }
      } else if (data.action === 'pause') {
        if (videoRef != null && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = data.time + '';
          console.log(data.time + '');
        }
      } else if (data.action === 'end') {
        if (user != null && user.is_mod == true) {
          Router.push('/dashboard');
        } else {
          logout();
          Router.push('/');
        }
      } else if (data.action === 'skip') {
        if (videoRef != null && videoRef.current) {
          videoRef.current.currentTime = data.time;
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [socketRef, videoRef]);

  useEffect(() => {
    if (videoRef != null && videoRef.current != null) {
      setPlayer(videoRef.current);
    }
    if (!playerRef.current && videoRef.current != null && videoRef != null) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videoJs(videoElement, () => {
        console.log('player is ready');
      }));
    }
    return () => {};
  }, [videoRef]);

  return (
    <>
      {session.name !== 'dummy' ? <h2> {session.name} </h2> : ''}
      <div className={styles.videocontainer}>
        <div className={styles.videocontainer}>
          <div key={session.tan}>
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
              onClick={
                user != null && user.is_mod == true
                  ? togglePlayPause
                  : (e) => {
                      return;
                    }
              }
            >
              <source src={VIDEO_PREFIX + session.video_path} type="video/mp4" />
            </video>
          </div>

          <div className={styles.chapterinfocontainer} style={{ visibility: visibleChapterText }}>
            <p className={styles.chapterinfo}> {chapterText}</p>
          </div>
          {user != null && user.is_mod == true ? (
            <div className={styles.controls}>
              <div className={styles.progressbarcontainer} onClick={changeVideoPosition.bind(this)}>
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
            <div className={styles.controls}>
              <div className={styles.progressbarcontainer} onClick={changeVideoPosition.bind(this)}>
                <div
                  className={styles.progressbar}
                  id="progressbar"
                  style={{ width: progressBarWidth }}
                ></div>
                {markers}
              </div>
            </div>
          )}
        </div>
      </div>
      {user != null && user.is_mod == true ? (
        <List
          size="small"
          className="list-h"
          dataSource={markerList}
          renderItem={(markerList) => (
            <List.Item className="menu-item">
              <Button
                type="default"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  paddingLeft: '25px',
                  paddingRight: '25px'
                }}
                onClick={handleListClick.bind(this)}
              >
                {markerList.text}
              </Button>
            </List.Item>
          )}
        />
      ) : (
        ''
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  sessionInfo: state.session.sessionInfo,
  user: state.auth.user,
  loading: state.session.loading
});

export default connect(mapStateToProps, { getInfoSession, loadUser, logout })(Video);
