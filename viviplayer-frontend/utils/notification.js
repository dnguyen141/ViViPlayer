import { notification } from 'antd';

export const Notification = (mess, noti, type) => {
  notification[type]({
    message: mess,
    description: noti,
    onClick: () => {
      console.log('Notification Clicked!');
    }
  });
};
