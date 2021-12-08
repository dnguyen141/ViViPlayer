import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'videojs-markers';
import videoJs from 'video.js';
import { Button } from 'antd';
import styles from "./video.module.css"; 
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
  const progressRef = React.useRef(null); 
  //const playbtnRef = React.useRef(null);
  const volumeRef  = React.useRef(null); 
  const [player, setPlayer] = useState(null);

  function togglePlayPause(){
    if(videoRef.current.paused){
        videoRef.current.play();
    }else{
        videoRef.current.pause();
    }
  } 

  function updateProgressBar(){ //stop when you are on a marker?
    requestAnimationFrame(() => {
        var currentPosition = videoRef.current.currentTime / videoRef.current.duration; 
        progressRef.current.style.width = currentPosition * 100 + "%";
    });
  }

  function changeVideoPosition(e){
      if(videoRef.current.readyState > 2){ //check if video is ready to be played
    
        //calculating the relative position of the click.
        var clickX = e.nativeEvent.offsetX; 
        var newPosition = clickX/ videoRef.current.clientWidth;  

        //setting the values for the progressbar and the videotime
        progressRef.current.style.width = newPosition * 100 + "%"; 
        videoRef.current.currentTime = newPosition * videoRef.current.duration; 
      }
      
  }

  function changeVolume(){
      videoRef.current.volume = volumeRef.current.value;
  }

  /*useEffect(() => {
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
      //player.autoplay('muted');
      // player.pause();
      pauseVideo(player);
    }
    return () => {};
  }, [videoRef]);*/
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
      <h2>Video</h2>
      <div className={styles.videocontainer}>
      <video
        // onProgress={(e) => pauseSegment(e)}
        onTimeUpdate={updateProgressBar}
        ref={videoRef}
        id="video-viviplayer"
        //controls
        preload="none"
        data-setup='{"fluid":true}' //This is used so that the video player is responsive
        className="video-js vjs-default-skin vjs-big-play-centered"
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          type="video/mp4"
        />
      </video>
      <div className={styles.controls}>
                    <div className={styles.progressbarcontainer} onMouseDown={changeVideoPosition} maxWidth="100%">
                        <div className={styles.progressbar}  ref={progressRef}  id="progressbar" ></div>
    	            </div>
                        
                    <div className={styles.buttons}>
                        <button id="play-pause-button" onClick={togglePlayPause}>
                           PLAY
                        </button>
                    </div>
                    <input 
                        type="range" 
                        className="volume"
                        min="0" 
                        max="1" 
                        step="0.01" 
                        defaultValue="0.5" 
                        onChange={changeVolume}
                        ref={volumeRef}
                    />
                    
                    <div className={styles.time}>
                        <span className={styles.current}>0:00</span> / <span className={styles.duration}>0:00</span>
                    </div>
                    
        </div>         
      </div> 
      
    </>
  );
};

export default Video;
