const prisma = require("../prisma/prismaclient");

const getUsers = async (id) => {
  const usersdata = await prisma.user_data.findMany({
    where: { id: { not: id }, is_verified: true },
  });
  return usersdata;
};

const getMessages = async (mid, uid) => {
  const messages = await prisma.messages.findMany({
    where: {
      OR: [
        { senderid: uid, receiverid: mid },
        { senderid: mid, receiverid: uid },
      ],
    },
    orderBy: { created_at: "asc" },
  });

  return messages;
};

const createMessage = async (senderID, receiverID, text, imageURL) => {
  const newMessage = await prisma.messages.create({
    data: {
      senderid: senderID,
      receiverid: receiverID,
      text,
      image: imageURL,
      created_at: new Date(),
    },
  });
  return newMessage;
};
module.exports = {
  getUsers,
  getMessages,
  createMessage,
};
