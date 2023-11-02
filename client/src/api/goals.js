import axios from './axios'

export const getGoalsRequest = () => axios.get("/goals")

export const getGoalRequest = (company) => axios.get(`/goals/${company}`)

export const createGoalRequest = (goal) => axios.post("/goals", goal)

export const updateGoalRequest = (id, goal) => axios.put(`/goals/${id}`, goal)

export const deleteGoalRequest = (id) => axios.delete(`/goals/${id}`)