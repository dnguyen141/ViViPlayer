import '../styles/globals.css';
import '../styles/dasboard.css';
import 'antd/dist/antd.css';
import 'videojs-markers/dist/videojs.markers.css';
import 'video.js/dist/video-js.css';
import 'survey-react/modern.min.css';
import 'survey-react/survey.css';
import { wrapper } from '../store';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
