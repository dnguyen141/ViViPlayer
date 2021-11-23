import React, { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Vivilayout from '../../layout/index';
let socket;
const Video = () => {
  socket = io('http://localhost:5000');
  const videoRef = React.useRef(null);
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    if (videoRef.current != null) {
      setPlayer(videoRef.current);
    }
    return () => {};
  }, [videoRef]);
  const playVideo = (video) => {
    console.log('video play');
    video.play();
  };
  const pauseVideo = (video) => {
    console.log('PAUSE');
    video.pause();
  };
  return (
    <Vivilayout>
      <h3>Video</h3>
      <video
        // onProgress={(e) => pauseSegment(e)}
        ref={videoRef}
        id="video-viviplayer"
        controls
        preload="none"
        width="600"
        height="400"
        className="video-js vjs-default-skin"
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
    </Vivilayout>
  );
};

Video.propTypes = {};

export default Video;
