import axios from './axios'

export const getMessagesRequest = () => axios.get("/messages")

export const getMessageRequest = (id) => axios.get(`/messages/${id}`)

export const createMessageRequest = (message) => axios.post("/messages", message)

export const deleteMessageRequest = (id) => axios.delete(`/messages/${id}`)

export const updateMessageRequest = (id,message) => axios.put(`/messages/${id}`, message)