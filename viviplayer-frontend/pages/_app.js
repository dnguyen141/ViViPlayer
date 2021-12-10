import React from 'react';
import '../styles/globals.css';
import '../styles/dasboard.css';
import 'antd/dist/antd.css';
import 'videojs-markers/dist/videojs.markers.css';
import 'video.js/dist/video-js.css';
import Home from './index';

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps}>
      <Home user={'abcs'} />
    </Component>
  );
}

export default MyApp;
