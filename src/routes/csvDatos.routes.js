import multer from 'multer';
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getCsvDatos, getCsvDato, createCsvDato, deleteCsvDato, updateCsvDato, getPredict, postPredictCategory } from "../controllers/csvDatos.controllers.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/csvDatos", authRequired, getCsvDatos);
router.get("/csvDatos/:company", getCsvDato);
router.post("/csvDatos", authRequired, upload.single('archivoCSV'), createCsvDato);
router.delete("/csvDatos/:id", authRequired, deleteCsvDato);
router.put("/csvDatos/:id", authRequired, updateCsvDato);

router.get("/predict/:company", getPredict)
router.post("/predictCategory/:company", postPredictCategory)

export default router;