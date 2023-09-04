import { Router } from "express";
import { login, registro, logout, profile} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router()

router.post('/registro', registro)
router.post('/login', login)
router.post('/logout', logout)
router.get('/profile', authRequired, profile)

export default router;