import axios from './axios'

export const getcompaniesRequest = () => axios.get(`/companies`)

export const getCompanyRequest = (id) => axios.post(`/companies/${id}`, company)

export const createCompanyRequest = company => axios.post(`/companies`, company)

export const updateCompanyRequest = (id, company) => axios.post(`/companies/${id}`, company)