import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getUsuarios, getUsuario, createUsuario, deleteUsuario, updateUsuario, updatePass, updateActive, updateTypeUser } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/usuarios", authRequired, getUsuarios);
router.get("/usuarios/:id", authRequired, getUsuario);
router.post("/usuarios", authRequired, createUsuario);
router.delete("/usuarios/:id", authRequired, deleteUsuario);
router.put("/usuarios/:id", authRequired, updateUsuario);
router.put("/usuarios/active/:id", authRequired, updateActive);
router.put("/usuarios/edit/:id", authRequired, updateTypeUser);

router.put("/usuarios/recover/correo/:correo", updatePass);

export default router