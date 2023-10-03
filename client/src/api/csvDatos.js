import axios from './axios'

export const getCsvDatosRequest = () => axios.get("/csvDatos")

export const getCsvDatoRequest = (id) => axios.get(`/csvDatos/${id}`)

const headers = {
    'Content-Type': 'multipart/form-data',
  };

export const createCsvDatosRequest = (csv) => axios.post("/csvDatos", csv, {headers: headers})

export const updateCsvDatosRequest = (id, csv) => axios.put(`/csvDatos/${id}`, csv)

export const deleteCsvDatosRequest = (id) => axios.delete(`/csvDatos/${id}`)