import React, { useRef, useState, useEffect } from "react";
import { Button, Rate } from "antd";
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
  const [code, setCode] = useState("");
  const [player, setPlayer] = useState(null);
  const [manuellSegment, setManuellSegment] = useState();
  const [updateComponent, setUpdateComponent] = useState(false);
  let getSegmentFromStogare = localStorage.getItem("segmentSetting");
  // console.log("typeof Segment", typeof JSON.parse(getSegmentFromStogare));
  // console.log("typeof markersDefault", typeof markersDefault);
  // console.log(updateComponent);
  // set state for default markers and video

  // Connection opened
  // const roomName = "demo";
  socket = io("http://localhost:5000");
  useEffect(() => {
    setMarkers(markersDefault);
    if (videoRef.current != null) {
      setPlayer(videoRef.current);
    }
  }, []);

  useEffect(() => {
    // const chatSocket = new WebSocket(
    //   "ws://" + window.location.host + "/ws/chat/" + roomName + "/"
    // );
    // console.log(chatSocket);
    // socket.on("connection", (socket) => {
    //   socket.emit("hello", "world");
    // });
    // socket.on("hello", (arg) => {
    //   console.log(arg); // world
    // });

    console.log(socket);
    setManuellSegment(JSON.parse(getSegmentFromStogare));
    buildMarkers(player, manuellSegment);
    // console.log(manuellSegment);
  }, [getSegmentFromStogare, code]);

  const jumpToChapter = (video, { text, time }) => {
    video.currentTime = time;
    // return video;
  };
  socket.on("codeTransaction", (code) => {
    console.log(code);
    // callback();
  });

  const sendCode = (code) => {
    if (code) {
      socket.emit("sendCode", code, () => setCode(code));
    }

    console.log("sencode function", code);
  };

  useEffect(() => {
    socket.on("sendCode", (code) => {
      console.log(code);
    });
    console.log("run effect socket on ");
  }, [code]);
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
      <video
        id="test_video"
        ref={videoRef}
        controls
        preload="none"
        className="video-js vjs-default-skin"
        width="600"
        height="400"
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          type="video/mp4"
        />
      </video>
      <div>
        Video rating: <Rate />
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
        <button onClick={() => sendCode("ABC")}>Send code</button>
      </div>
    </div>
  );
};

export default App;
