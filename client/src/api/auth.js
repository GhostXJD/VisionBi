import axios from 'axios'

const API = 'http://localhost:4000/api'

export const registroRequest = usuario => axios.post(`${API}/registro`, usuario);