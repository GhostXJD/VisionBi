import axios from './axios'

export const getCsvDatosRequest = () => axios.get("/csvDatos")

export const getCsvDatoRequest = (company) => axios.get(`/csvDatos/${company}`)

const headers = {
    'Content-Type': 'multipart/form-data',
  };

export const createCsvDatosRequest = (csv) => axios.post("/csvDatos", csv, {headers: headers})

export const updateCsvDatosRequest = (id, csv) => axios.put(`/csvDatos/${id}`, csv)

export const deleteCsvDatosRequest = (id) => axios.delete(`/csvDatos/${id}`)

export const getPredictRequest = (company) => axios.get(`/predict/${company}`)