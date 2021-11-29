import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'videojs-markers';
import videoJs from 'video.js';
import { Button } from 'antd';
import Vivilayout from '../../layout/index';
let socket;
const markersDefault = [
  {
    time: 4,
    text: 'Chapter 1'
  },
  {
    time: 10,
    text: 'Chapter 2'
  },
  {
    time: 23.6,
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
const Video = () => {
  socket = io('http://localhost:5000');
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [player, setPlayer] = useState(null);
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
      // add markers
      player.markers({
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
          display: true,
          displayTime: 3,
          text: function (marker) {
            return marker.text;
          }
        },
        onMarkerReached: function (marker) {
          console.log(marker);
          // player.pause();
        },
        markers: markersDefault
      });
      player.autoplay('muted');
      // player.pause();
      pauseVideo(player);
    }
    return () => {};
  }, [videoRef]);
  socket.on('getCommandToPlayVideo', () => {
    // console.log("lets play");
    if (player) {
      player.play();
    }
  });
  socket.on('getCommandToPauseVideo', () => {
    if (player) {
      player.pause();
    }
  });
  const playVideo = (video) => {
    video.play();
    socket.emit('playVideo');
  };
  const pauseVideo = (video) => {
    console.log('PAUSE');
    video.pause();
    socket.emit('pauseVideo');
  };
  return (
    <>
      <h3>Video</h3>
      <video
        // onProgress={(e) => pauseSegment(e)}
        ref={videoRef}
        id="video-viviplayer"
        controls
        preload="none"
        className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          type="video/mp4"
        />
      </video>
      <div>
        <Button type="primary" onClick={() => playVideo(player)}>
          Play video
        </Button>
        <Button type="danger" onClick={() => pauseVideo(player)}>
          Pause video
        </Button>
      </div>
    </>
  );
};

export default Video;
