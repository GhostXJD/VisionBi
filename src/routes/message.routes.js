import { Router } from "express";
import { getMessages, getMessage, createMessage, deleteMessage, updateMessage } from "../controllers/messages.controller.js";

const router = Router();

router.get("/messages", getMessages);
router.get("/messages/:id", getMessage);
router.post("/messages", createMessage);
router.delete("/messages/:id", deleteMessage);
router.put("/messages/:id", updateMessage);

export default router