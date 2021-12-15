import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'videojs-markers';
import videoJs from 'video.js';
import { Button } from 'antd';
import styles from "./video.module.css"; 
let socket;
var messages = ""; 
var markerListDefault = [
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
const Video = () => {
  socket = io('http://localhost:5000');
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [player, setPlayer] = useState(null);
  const [progressBarWidth, setProgressBarWidth] = useState("100%");
  const [markerList, setMarkerList] = useState(markerListDefault);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");



    function calculateMarkerPosition(){
        if(videoRef.current.readyState < 1){
            setTimeout(calculateMarkerPosition, 500); 
 
        }
        messages = markerList.map(marker=> <div title={marker.text} className={styles.markers} style={{left: marker.time / videoRef.current.duration * 100 + "%"}}/>);
    
    }
  function togglePlayPause(){
    if(videoRef.current.paused){ 
        videoRef.current.play();
    }else{
        videoRef.current.pause();
    }
  } 

  function updatePlayer(){ //stop when you are on a marker?
    requestAnimationFrame(() => {
        if(videoRef.current.readyState < 2){
            setTimeout(updatePlayer, 500);
        }
        var currentPosition = videoRef.current.currentTime / videoRef.current.duration; 
        setProgressBarWidth(currentPosition * 100 + "%");

        var currentMinutes = Math.floor(videoRef.current.currentTime / 60);
        var currentSeconds = Math.floor(videoRef.current.currentTime - currentMinutes * 60);
        if(currentSeconds < 10){
            currentSeconds = "0" + currentSeconds; 
        }
        setCurrentTime(currentMinutes + ":" + currentSeconds);

        var durationMinutes = Math.floor(videoRef.current.duration / 60);
        var durationSeconds = Math.floor(videoRef.current.duration - durationMinutes * 60);

        setDuration(durationMinutes + ":" + durationSeconds);
        
    });
  }

  function changeVideoPosition(e){
      if(videoRef.current.readyState > 2){ //check if video is ready to be played
    
        //calculating the relative position of the click.
        var clickX = e.nativeEvent.offsetX; 
        var newPosition = clickX/ videoRef.current.clientWidth;  

        //setting the values for the progressbar and the videotime
        setProgressBarWidth(newPosition * 100 + "%"); 
        videoRef.current.currentTime = newPosition * videoRef.current.duration; 
      }
      
  }
  //run only one time after the first render.
    useEffect(() => {
        calculateMarkerPosition();
        updatePlayer();
     }, [])
 

    //replaces the old markers with the new markers if the list changes
    useEffect(() => {
        calculateMarkerPosition(videoRef.current)
    }, [markerList]) 

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
        markers: markerListDefault
      });
      //player.autoplay('muted');
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
      <h2>Video</h2>
      <div className={styles.videocontainer}>
      <video
        // onProgress={(e) => pauseSegment(e)}
        onTimeUpdate={updatePlayer}
        ref={videoRef}
        id="video-viviplayer"
        //controls
        preload='metadata'
        data-setup='{"fluid":true}' //This is used so that the video player is responsive
        className="video-js vjs-default-skin vjs-big-play-centered"
        onClick={togglePlayPause}
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          type="video/mp4"
        />
      </video>
      <div className={styles.controls}>
                    <div className={styles.progressbarcontainer} onMouseDown={changeVideoPosition}>
                        <div className={styles.progressbar}  id="progressbar" style={{width: progressBarWidth}} ></div>
                        {messages}
    	            </div>
                        
                    <div className={styles.buttons}>
                        <button id="play-pause-button" onClick={togglePlayPause}>
                           PLAY
                        </button>
                    </div>
                    <input 
                        type="range" 
                        className={styles.volumeslider}
                        min="0" 
                        max="1" 
                        step="0.01" 
                        defaultValue="0.5" 
                        onChange={(e) =>videoRef.current.volume = e.target.value}
                    />
                    
                    <div className={styles.time}>
                        <span>{currentTime}</span> / <span>{duration}</span>
                    </div>
                    
        </div>         
      </div> 
      
    </>
  );
};

export default Video;
