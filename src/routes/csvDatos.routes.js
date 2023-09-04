import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getCsvDatos, getCsvDato, createCsvDato, deleteCsvDatos, updateCsvDatos } from "../controllers/csvDatos.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js"
import { createCsvSchema } from "../schemas/csvDato.schema.js";

const router = Router();

router.get("/csvDatos", authRequired, getCsvDatos);
router.get("/csvDatos/:id", authRequired, getCsvDato);
router.post("/csvDatos", authRequired, validateSchema(createCsvSchema), createCsvDato);
router.delete("/csvDatos/:id", authRequired, deleteCsvDatos);
router.put("/csvDatos/:id", authRequired, updateCsvDatos);

export default router;