import { Router } from "express";
import { createCompany, getCompany, getCompanies, updateCompany } from '../controllers/companies.controller.js'
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createCompanySchema } from '../schemas/company.schema.js';

const router = Router()

router.get('/companies', authRequired, getCompanies)
router.get('/companies/:id', authRequired, getCompany)
router.post('/companies', validateSchema(createCompanySchema), createCompany)
router.put('/companies/:id', authRequired, updateCompany)

export default router