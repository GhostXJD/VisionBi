import { createContext, useContext, useState } from 'react'
import { createCsvDatosRequest } from '../api/csvDatos'

const CsvContext = createContext();

export const useCsv = () => {
    const context = useContext(CsvContext);
    if (!context) {
        throw new Error("useCsv must be used within a CsvProvider")
    }
    return context;
}

export function CsvProvider({ children }) {
    const [Csv, setCsv] = useState([]);
    const [errors, setErrors] = useState([]);

    const createCsv = async (csv) => {
        try {
            await createCsvDatosRequest(csv)
        } catch (error) {
            setErrors(error.response.data);
        }
    }

    return (
        <CsvContext.Provider value={{
            Csv,
            createCsv,
            errors,
        }}
        >
            {children}
        </CsvContext.Provider>
    )

}