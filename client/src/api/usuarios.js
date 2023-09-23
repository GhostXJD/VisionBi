import axios from './axios'

export const getUsuariosRequest = () => axios.get("/usuarios")

export const getUsuarioRequest = (id) => axios.get(`/usuarios/${id}`)

export const createUsuarioRequest = (usuario) => axios.post("/usuarios", usuario)

export const updateUsuarioRequest = (id, usuario) => axios.put(`/usuarios/${id}`, usuario)

export const deleteUsuarioRequest = (id) => axios.delete(`/usuarios/${id}`)