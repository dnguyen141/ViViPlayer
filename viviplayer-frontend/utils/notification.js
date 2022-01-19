import { notification } from 'antd';

/**
 * Sends a notification to the screen.
 * @param {string} mess The Title of the notification.
 * @param {*} noti The description of the notification.
 * @param {*} type Type of notfication.
 */
export const Notification = (mess, noti, type) => {
  notification[type]({
    message: mess,
    description: noti,
    onClick: () => {
      console.log('Notification Clicked!');
    }
  });
};
