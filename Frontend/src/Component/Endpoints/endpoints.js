
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
    sendGroupMessage: 'message/group/send',
    getMessage: 'message/get',
    getGroupMessage: 'message/group',
    deleteConversation: 'message/conversation',
    deleteGroupConversation: 'message/group-chat',
    markMessageRead: 'message/read',
    unReadMessageCount: 'message/unread-count',
  },
  group: {
    createGroup: '/groups/create',
    myGroups: '/groups/my-groups',
    deleteGroup: '/groups',
  },
};
