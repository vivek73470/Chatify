
export const endpoints = {
  register: '/register',
  login: '/login',
  verifyNumber: '/verifyNumber',
  resetPassword: '/resetPassword',
  logout: '/logout',

  alluser: {
    getAllUser: '/users/getAllUsers',
  },
  message: {
    sendMessage: 'message/send',
    getMessage: 'message/get',
    markMessageRead: 'message/read',
    markMessageDelivered: 'message/delivered',
    unReadMessageCount: 'message/count',
  }
};
