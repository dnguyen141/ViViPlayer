import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import Segment from "./Segment";
import io from "socket.io-client";
const markersDefault = [
  {
    time: 2,
    text: "Chapter 1",
  },
  {
    time: 16,
    text: "Chapter 2",
  },
  {
    time: 23.6,
    text: "Chapter 3",
  },
  {
    time: 50,
    text: "Chapter 4",
  },
  {
    time: 136,
    text: "Chapter 5",
  },
  {
    time: 226,
    text: "Chapter 6",
  },
];
let socket;
const App = () => {
  const videoRef = useRef(null);
  const [marker, setMarkers] = useState();
  const [player, setPlayer] = useState(null);
  const [manuellSegment, setManuellSegment] = useState();
  const [updateComponent, setUpdateComponent] = useState(false);
  let getSegmentFromStogare = localStorage.getItem("segmentSetting");

  socket = io("http://localhost:5000");
  useEffect(() => {
    setMarkers(markersDefault);
    if (videoRef.current != null) {
      setPlayer(videoRef.current);
    }
  }, [marker]);

  useEffect(() => {
    setManuellSegment(JSON.parse(getSegmentFromStogare));
    buildMarkers(player, manuellSegment);
    // console.log(manuellSegment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, getSegmentFromStogare]);
  // remove controls
  // if (player) {
  //   player.removeAttribute("controls");
  // }
  const jumpToChapter = (video, { text, time }) => {
    video.currentTime = time;
    socket.emit("jumpToChapter", time);

    // return video;
  };
  socket.on("getCommandToJumpChapter", (time) => {
    if (player) {
      player.currentTime = time;
    }
  });
  socket.on("getCommandToPlayVideo", () => {
    if (player) {
      player.play();
    }
    console.log("play video");
  });
  socket.on("getCommandToPauseVideo", () => {
    if (player) {
      player.pause();
    }
  });
  const playVideo = () => {
    player.play();
    socket.emit("playVideo");
  };
  const pauseVideo = () => {
    player.pause();
    socket.emit("pauseVideo");
  };

  // const notiChapter = (text, time) => {
  //   return (
  //     <Modal title="Basic Modal" visible={isModalVisible}>
  //       <h3>
  //         {text} - {time} second
  //       </h3>
  //     </Modal>
  //   );
  // };

  // if (marker !== null && marker !== undefined) {
  //   console.log("marker inside", marker);
  //   console.log("typeof marker inside", typeof marker);
  //   buildMarkers = marker.map((chapter, index) => {
  //     return (
  //       <div key={index}>
  //         <Button
  //           type="primary"
  //           ghost
  //           onClick={() => jumpToChapter(player, chapter)}
  //         >
  //           {chapter.text} - {chapter.time} seconds
  //         </Button>
  //       </div>
  //     );
  //   });
  // }

  const buildMarkers = (video, segmentObj) => {
    if (segmentObj === undefined || segmentObj === null) return;
    let markersBuiled = segmentObj.map((chapter, index) => {
      return (
        <Button
          type="primary"
          ghost
          onClick={() => jumpToChapter(video, chapter)}
        >
          {chapter.text} - {chapter.time} seconds
        </Button>
      );
    });
    return markersBuiled;
  };
  return (
    <div className="App">
      <video ref={videoRef} controls preload="none" width="600" height="400">
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          type="video/mp4"
        />
      </video>
      <div>
        <Button type="primary" onClick={() => playVideo()}>
          Play video
        </Button>
        <Button type="danger" onClick={() => pauseVideo()}>
          Pause video
        </Button>
      </div>
      <ul id="marker-list"></ul>
      <h2>Chapter</h2>
      {marker === null || marker === undefined
        ? "undivided video"
        : buildMarkers(
            player,
            manuellSegment !== null ? manuellSegment : marker
          )}
      <div>
        <Segment
          updateSegment={updateComponent}
          setUpdateSegment={setUpdateComponent}
        />
      </div>
    </div>
  );
};

export default App;
