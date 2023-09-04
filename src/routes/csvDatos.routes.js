import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";

const router = Router();

router.get("/csvDatos", authRequired, async (req, res) => res.send("CSV"));

export default router;