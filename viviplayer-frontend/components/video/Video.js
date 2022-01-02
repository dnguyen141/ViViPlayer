import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'videojs-markers';
import videoJs from 'video.js';
import { Button, List } from 'antd';
import { connect } from 'react-redux';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import styles from './video.module.css';
import { getInfoSession } from '../../actions/session.action';
import { loadUser } from '../../actions/auth.action';
import { setAuthToken } from '../../utils/setAuthToken';
import api from '../../utils/api';
let socket;
var markers = '';
var markerListDefault = [
  // !!! markers need to be an Integer
  {
    time: 4,
    text: 'Chapter 1'
  },
  {
    time: 10,
    text: 'Chapter 2'
  },
  {
    time: 23,
    text: 'Chapter 3'
  },
  {
    time: 50,
    text: 'Chapter 4'
  },
  {
    time: 136,
    text: 'Chapter 5'
  },
  {
    time: 226,
    text: 'Chapter 6'
  }
];
const Video = ({ loadUser, loading, user }) => {
  const [userState, setUserState] = useState(null);
  const [session, setSession] = useState({
    name: 'dummy',
    tan: 'dummytan',
    video_path:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
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
    // console.log(res.data[0]);
    setSession(res.data[0]);
    // log user out from all tabs if they log out in one tab
    // window.addEventListener('storage', () => {
    //   if (!localStorage.token) {
    //     type: LOGOUT;
    //   }
    // });
  }, [loading]);
  useEffect(() => {
    if (user) {
      setUserState(user);
    }
  }, []);

  socket = io('http://localhost:5001');
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [player, setPlayer] = useState(null);
  const [progressBarWidth, setProgressBarWidth] = useState('100%');
  const [markerList, setMarkerList] = useState(markerListDefault);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [playPauseIcon, setPlayPauseIcon] = useState(
    <CaretRightOutlined style={{ fontSize: '150%' }} />
  );
  const [autoStop, setAutoStop] = useState(false);
  const [chapterText, setChapterText] = useState('');
  const [lastTime, setLastTime] = useState(0);
  const [visibleChapterText, setVisibleChapterText] = useState('translateY(-100%)'); // -100% = disappear, 0 = appear

  //maps the markers of the markersList to individual <div> elements that then get drawn on the progressbar. every change of the markerList should also rerender the
  // markers. if not markers has to be an state too.
  function calculateMarkerPosition() {
    if (videoRef.current.readyState < 1) {
      setTimeout(calculateMarkerPosition, 500);
    }
    markers = markerList.map((marker) => (
      <div
        title={marker.text}
        className={styles.markers}
        style={{ left: (marker.time / videoRef.current.duration) * 100 + '%' }}
      />
    ));
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
    // if it finds a marker at that spot it will pause the video and display the chapter text. the bigger time gap is necessary because
    // the execution time isnt predictable and it will cause the player to skip the marker.
    var temp = markerList.find(
      (x) => videoRef.current.currentTime >= x.time && videoRef.current.currentTime <= x.time + 1
    );

    if (temp != null) {
      setVisibleChapterText('translateY(0%)');
      console.log(lastTime);
      setLastTime(temp.time); //last marker that was found.
      setChapterText(temp.text);
      if (autoStop) {
        //when the player didnt already stop at this marker the player gets paused. this prevents multiple pauses at one marker and it doesnt get stuck
        if (videoRef.current.currentTime >= lastTime + 1) {
          videoRef.current.pause();
        }
      }
    } else if (lastTime != 0) {
      setLastTime(-1); //resets the last chapter so that it can be played again.
    }

    requestAnimationFrame(() => {
      //checks whether the chapter title should still be shown
      if (lastTime == -1 || videoRef.current.currentTime > lastTime + 5) {
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

  //gets called when a button in the list gets pressed. it changes the video position to the time specified in the marker.
  function handleListClick(e) {
    if (videoRef.current.readyState > 2) {
      //check if video is ready to be played
      var text = e.target.innerHTML.toString();
      console.log(text);
      if (text != null) {
        var currentMarker = markerList.find((x) => x.text === text);
        if (currentMarker != null) {
          var newPosition = currentMarker.time / videoRef.current.duration;
          setProgressBarWidth(newPosition * 100 + '%');
          videoRef.current.currentTime = currentMarker.time;
          videoRef.current.pause();
        }
      }
    }
  }

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

      // DEPRECATED: new implementation of markers and autoStop in calculateMarkerPostition and updatePlayer

      /* player.markers({
        markerStyle: {
          width: '8px',
          'background-color': 'red'
        },
        markerTip: {
          display: true,
          html: function (marker) {
            return <EditableMarkers text={marker.text} />;
          }
        },
        breakOverlay: {
          display: false,
          displayTime: 3,
          text: function (marker) {
            return marker.text;
          }
        },
        onMarkerReached: function (marker) {
          console.log(marker);  
        },
        markers: markerListDefault
      });
      //player.autoplay('muted');
      // player.pause();
      pauseVideo(player);*/
    }
    return () => {};
  }, [videoRef]);
  // socket.on('getCommandToPlayVideo', () => {
  //   // console.log("lets play");
  //   if (player) {
  //     player.play();
  //   }
  // });
  // socket.on('getCommandToPauseVideo', () => {
  //   if (player) {
  //     player.pause();
  //   }
  // });
  // const playVideo = (video) => {
  //   video.play();
  //   socket.emit('playVideo');
  // };
  // const pauseVideo = (video) => {
  //   console.log('PAUSE');
  //   video.pause();
  //   socket.emit('pauseVideo');
  // };
  return (
    <>
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
                <source src={session.video_path} type="video/mp4" />
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
                <source src={session.video_path} type="video/mp4" />
              </video>
            </div>
          )}
          <div className={styles.chapterinfocontainer} style={{ transform: visibleChapterText }}>
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
            ''
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

export default connect(mapStateToProps, { getInfoSession, loadUser })(Video);
