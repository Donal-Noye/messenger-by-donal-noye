export const routes = {
  home: () => "/",
  signIn: () => `/sign-in`,
  signUp: () => `/sign-up`,
  settings: () => `/settings`,
  users: () => `/users`,
  group: (groupId: string) => `/group/${groupId}`,
  groupStream: (groupId: string) => `/group/${groupId}/stream/group`,
  messageActionsStream: (groupId: string, messageId: string) =>
    `/group/${groupId}/stream/message/${messageId}`,
  messageStream: (groupId: string) => `/group/${groupId}/stream/message`,
  typingStream: (groupId: string) => `/group/${groupId}/stream/message/typing`,
  groupsStream: () => "/groups/stream",
};
