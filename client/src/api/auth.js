import axios from './axios'

export const registroRequest = usuario => axios.post(`/registro`, usuario);

export const loginRequest = usuario => axios.post(`/login`, usuario);

export const verifyTokenRequet = () => axios.get('/verify');