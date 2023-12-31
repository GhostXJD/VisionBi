import axios from './axios'

export const getUsuariosRequest = () => axios.get("/usuarios")

export const getUsuarioRequest = (id) => axios.get(`/usuarios/${id}`)

export const createUsuarioRequest = (usuario) => axios.post("/usuarios", usuario)

export const updateUsuarioRequest = (id, usuario) => axios.put(`/usuarios/${id}`, usuario)

export const updateActiveRequest = (id, usuario) => axios.put(`/usuarios/active/${id}`, usuario)

export const updateTypeRequest = (id, usuario) => axios.put(`/usuarios/edit/${id}`, usuario)

export const updatePassUsuarioRequest = (correo) => axios.put(`/usuarios/recover/correo/${correo}`)

export const deleteUsuarioRequest = (id) => axios.delete(`/usuarios/${id}`)