import multer from 'multer';
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getCsvDatos, getCsvDato, createCsvDato, deleteCsvDato, updateCsvDato } from "../controllers/csvDatos.controllers.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/csvDatos", authRequired, getCsvDatos);
router.get("/csvDatos/:company", getCsvDato);
router.post("/csvDatos", authRequired, upload.single('archivoCSV'), createCsvDato);
router.delete("/csvDatos/:id", authRequired, deleteCsvDato);
router.put("/csvDatos/:id", authRequired, updateCsvDato);

export default router;