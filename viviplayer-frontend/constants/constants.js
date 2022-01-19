/**
 * The server backend address.
 */
export const SERVER_BACKEND = process.env.VIVIMODE==='prod' ? '' : 'http://127.0.0.1:8000';

/**
 * The websocket backend address.
 */
export const WS_BACKEND = process.env.VIVIMODE==='prod' ? '' : 'ws://127.0.0.1:8000';

/**
 * The prefix for videos in backend.
 */
export const VIDEO_PREFIX = SERVER_BACKEND + '/media/';
