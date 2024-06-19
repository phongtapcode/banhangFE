import { message } from 'antd';

export const success = (mess) => {
  message.success(mess);
};
export const error = (mess) => {
  message.error(mess);
};
export const warning = (mess) => {
  message.warning(mess);
};