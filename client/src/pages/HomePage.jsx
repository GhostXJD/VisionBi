//TODO: Mostrar los datos del csv en el front
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../context/AuthContext';
import { useCsv } from '../context/CsvContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsvDatosRequest } from '../api/csvDatos';
import Papa from 'papaparse';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, usuario } = useAuth();
    const { createCsv } = useCsv();
    const [archivoCSV, setArchivoCSV] = useState(null);
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) navigate('/inicio');
    }, [isAuthenticated]);

    useEffect(() => {
        getCsvs();
    }, []);

    const getCsvs = async () => {
        try {
            const response = await getCsvDatosRequest();
            console.log("Respuesta de la API:", response);
    
            if (response && response.data && response.data[0] && response.data[0].archivoCSV) {
                const archivoCSVData = response.data[0].archivoCSV;
                const blob = new Blob([archivoCSVData.data], { type: archivoCSVData.type });
    
                const reader = new FileReader();
                reader.onload = (e) => {
                    const csvString = e.target.result;
                    Papa.parse(csvString, {
                        header: true,
                        dynamicTyping: true,
                        complete: (results) => {
                            setCsvData(results.data);
                        },
                    });
                };
                reader.readAsText(blob);
            } else {
                console.error("La respuesta no contiene datos de archivoCSV.");
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };    

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setArchivoCSV(file);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('archivoCSV', archivoCSV);
        formData.append('userUploader', usuario.rut);
        formData.append('company', usuario.company);

        try {
            const response = await createCsv(formData);
            console.log("Archivo CSV subido con éxito:", response);
            getCsvs();
        } catch (error) {
            console.error("Error al subir el archivo CSV:", error);
        }
    };

    return (
        <div>
            <div className='text-center'>
                <h1>homepage</h1>
                <form onSubmit={onSubmit}>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload CSV
                        <VisuallyHiddenInput
                            type="file"
                            name="archivoCSV"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </Button>
                    <div className='p-2'>
                        <Button type="submit" variant="contained" color="success">Subir CSV</Button>
                    </div>
                </form>
            </div>

            {/* Mostrar los datos del CSV en una tabla */}
            <div>
                <h2>Contenido del archivo CSV:</h2>
                <table>
                    <thead>
                        {csvData.length > 0 &&
                            Object.keys(csvData[0]).map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                    </thead>
                    <tbody>
                        {csvData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomePage;