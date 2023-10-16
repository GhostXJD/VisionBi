import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../context/AuthContext';
import { useCsv } from '../context/CsvContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsvDatoRequest } from '../api/csvDatos';
import Papa from 'papaparse';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

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
        getCsv();
    }, []);

    const getCsv = async () => {
        console.log("Obteniendo datos del archivo CSV...");
        try {
            const response = await getCsvDatoRequest(usuario.company);
            console.log("Respuesta de la API:", response);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data;
                    setCsvData(data);
                },
                header: true,
                skipEmptyLines: true,
            });

        } catch (error) {
            console.log("Error al obtener los datos:", error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setArchivoCSV(file);

        const reader = new FileReader();

        reader.onload = (event) => {
            const result = event.target.result;
            Papa.parse(result, {
                complete: (parsedData) => {
                    const data = parsedData.data;
                    setCsvData(data);
                },
                header: true,
                skipEmptyLines: true,
            });
        };
        reader.readAsText(file);
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
            getCsv();
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
                        Attach CSV
                        <VisuallyHiddenInput
                            type="file"
                            name="archivoCSV"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </Button>
                    <div className='p-2'>
                        <Button type="submit" variant="contained" color="success">Upload CSV</Button>
                    </div>
                </form>
            </div>

            {/* Mostrar los datos del CSV en una tabla */}
            <div>
                <h2>CSV file content:</h2>
                <Paper elevation={3} style={{ height: 550, width: '100%' }}>
                    <DataGrid
                        rows={csvData.map((row, rowIndex) => ({
                            id: rowIndex,
                            ...row,
                        }))}
                        columns={csvData.length > 0 ? Object.keys(csvData[0]).map((header) => ({
                            field: header,
                            headerName: header,
                            width: 150,
                        })) : []}
                        pageSize={5}
                    />
                </Paper>
            </div>
        </div>
    );
}

export default HomePage;