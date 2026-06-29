// src/api/chatApt.js
import axiosConfig from "./axiosConfig";

const chatApi = {
  getMessages: (receiverType, receiverId) => {
    return axiosConfig.get(`/messages/inbox?receiverType=${receiverType}&receiverId=${receiverId}`);
  },

  getConversation: (type1, id1, type2, id2) => {
    return axiosConfig.get(`/messages/conversation?type1=${type1}&id1=${id1}&type2=${type2}&id2=${id2}`);
  },

  sendMessage: (data) => {
    // Expected structure: senderType, senderId, receiverType, receiverId, content
    return axiosConfig.post("/messages", {
      senderType: data.senderType,
      senderId: data.senderId,
      receiverType: data.receiverType,
      receiverId: data.receiverId,
      content: data.content,
    });
  },
};

export default chatApi;