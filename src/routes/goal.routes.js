import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getGoal, getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goal.controller.js'

const router = Router();

router.get('/goals', getGoals);
router.get('/goals/:id', getGoal);
router.post('/goals', createGoal)
router.delete('/goals/:id', deleteGoal);
router.put('/goals/:id', updateGoal);

export default router