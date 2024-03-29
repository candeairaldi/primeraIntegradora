import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
    user: { type: String, index: true },
    message: String
});

const messageModel = mongoose.model(messagesCollection, messageSchema);

export default messageModel;