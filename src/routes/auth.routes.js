import { Router } from "express";
import { login, registro, logout, profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registroSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router()

router.post('/registro', validateSchema(registroSchema), registro)
router.post('/login', validateSchema(loginSchema), login)
router.post('/logout', logout)
router.get('/profile', authRequired, profile)

export default router;