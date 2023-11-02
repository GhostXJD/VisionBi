import { Router } from "express";
import { getMessages, getMessage, createMessage, deleteMessage } from "../controllers/messages.controller.js";

const router = Router();

router.get("/messages", getMessages);
router.get("/messages/:id", getMessage);
router.post("/messages", createMessage);
router.delete("/messages/:id", deleteMessage);

export default router