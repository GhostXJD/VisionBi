import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getUsuarios, getUsuario, createUsuario, deleteUsuario, updateUsuario } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/usuarios", authRequired, getUsuarios);
router.get("/usuarios/:id", authRequired, getUsuario);
router.post("/usuarios", authRequired, createUsuario);
router.delete("/usuarios/:id", authRequired, deleteUsuario);
router.put("/usuarios/:id", authRequired, updateUsuario);

export default router