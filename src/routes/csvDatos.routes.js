import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getCsvDatos, getCsvDato, createCsvDato, deleteCsvDato, updateCsvDato } from "../controllers/csvDatos.controllers.js";

const router = Router();

router.get("/csvDatos", authRequired, getCsvDatos);
router.get("/csvDatos/:id", authRequired, getCsvDato);
router.post("/csvDatos", authRequired, createCsvDato);
router.delete("/csvDatos/:id", authRequired, deleteCsvDato);
router.put("/csvDatos/:id", authRequired, updateCsvDato);

export default router;