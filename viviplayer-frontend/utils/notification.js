import { notification } from 'antd';

export const openNotification = (mess, noti) => {
  notification.open({
    message: mess,
    description: noti,
    onClick: () => {
      console.log('Notification Clicked!');
    }
  });
};
