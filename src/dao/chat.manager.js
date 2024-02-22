import messageModel from "./models/message.model.js";

export class ChatManager {
    static #instance;

    constructor() {
        this.messages = [];
    }

    static getInstance() {
        if (!ChatManager.#instance) {
            ChatManager.#instance = new ChatManager();
        }
        return ChatManager.#instance;
    }

    async getMessages() {
        try {
            this.messages = await messageModel.find();
            return this.messages;
        } catch (error) {
            throw error;
        }
    }

    async addMessage(message) {
        try {
            await messageModel.create(message);
            if (!message) {
                throw new Error("No se pudo crear el mensaje");
            }
            return;
        } catch (error) {
            throw error;
        }
    }
}