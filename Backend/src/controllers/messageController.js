import { v2 } from "cloudinary";
import * as messageServices from "../services/messageServices.js";
import * as socketjs from "../services/socket.js";

const getUsers = async (req, res) => {
  try {
    const loggedinUserid = req.user.id;
    console.log(loggedinUserid);
    const filtereduserd = await messageServices.getUsers(loggedinUserid);
    res.status(200).json({ data: filtereduserd });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const idtochat = Number(req.params.id);
    const senderID = req.user.id;

    const messages = await messageServices.getMessages(idtochat, senderID);

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receverID = Number(req.params.id);
    const senderID = req.user.id;

    let imageURL;
    if (image) {
      const uploadResponse = await v2.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = await messageServices.createMessage(
      senderID,
      receverID,
      text,
      imageURL
    );

    const receverSocketId = socketjs.getReceiverSocketId(receverID);

    if (receverSocketId) {
      socketjs.io.to(receverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { getUsers, getMessages, sendMessage };
