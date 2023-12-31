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
import moment from 'moment';
import Swal from 'sweetalert2';
import csv from "../images/csv.png";
import FileLines from '../components/FileLines';

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
    const [hasUploadedFile, setHasUploadedFile] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateCsvColumns = (data) => {
        // Define las columnas requeridas
        const requiredColumns = ['order', 'date', 'state', 'neighborhood', 'category', 'skuValue', 'totalValue'];

        // Obtiene las columnas del archivo CSV
        const csvColumns = Object.keys(data.length > 0 ? data[0] : {});

        // Verifica si todas las columnas requeridas están presentes
        const hasAllColumns = requiredColumns.every((column) => csvColumns.includes(column));

        if (!hasAllColumns) {
            // Muestra una alerta o mensaje de error
            Swal.fire({
                icon: 'error',
                text: 'El archivo CSV no tiene todas las columnas requeridas: ' + requiredColumns.join(', ') + '. verifique el formato solicitado',
                confirmButtonColor: '#8F3C8A',
            });
        }

        return hasAllColumns;
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    useEffect(() => {
        getCsv();
    }, []);

    const getCsv = async () => {
        try {
            const response = await getCsvDatoRequest(usuario.company);
            Papa.parse(response.data, {
                complete: (parsedData) => {
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: moment(row.date).format('YYYY-MM-DD'),
                    }));
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
                    const data = parsedData.data.map((row) => ({
                        ...row,
                        date: moment(row.date).format('YYYY-MM-DD'),
                    }));
                    setCsvData(data);
                },
                header: true,
                skipEmptyLines: true,
            });
            setHasUploadedFile(true);
        };
        reader.readAsText(file);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        // Validar las columnas antes de enviar el formulario
        if (!validateCsvColumns(csvData)) {
            return;
        }

        const formData = new FormData();
        formData.append('archivoCSV', archivoCSV);
        formData.append('userUploader', usuario.rut);
        formData.append('company', usuario.company);

        try {
            const response = await createCsv(formData);
            Swal.fire({
                icon: 'success',
                text: 'Archivo guardado satisfactoriamente',
                confirmButtonColor: '#8F3C8A',
            });

            setHasUploadedFile(false);
            getCsv();
        } catch (error) {
            console.error("Error al subir el archivo CSV:", error);
        }
    };

    return (
        <div className='uploadFile'>
            <div className='text-center'>
                <h1>Cargue su archivo histórico aquí</h1>
                <form onSubmit={onSubmit}>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} color="secondary">
                        Adjuntar CSV
                        <VisuallyHiddenInput
                            type="file"
                            name="archivoCSV"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </Button>
                    <div className='p-2'>
                        {hasUploadedFile && (
                            <>
                                <Button type="submit" variant="contained" color="secondary">GUARDAR EL ARCHIVO</Button>
                            </>
                        )}
                    </div>
                    <div className="file-guia" style={{ marginLeft: 'auto', width: '100px' }} onClick={(e) => { handleOpen(e) }}>
                        <img src={csv} alt="csv" className='file-img' style={{ marginLeft: 'auto', marginRight: '15px' }} />
                        <p>Ver formato</p>
                    </div>
                    {open && <FileLines open={open} handleClose={handleClose} />}
                </form>
            </div>

            <div className='file'>
                <h2 >Contenido del archivo CSV </h2>
                <DataGrid
                    rows={csvData.map((row, rowIndex) => ({
                        id: rowIndex,
                        ...row,
                    }))}
                    columns={csvData.length > 0 ? Object.keys(csvData[0]).map((header) => ({
                        field: header,
                        headerName: header,
                        flex: 1,
                        headerClassName: 'custom-header-class',
                    })) : []}
                    pageSize={5}
                    headerClassName='sticky-header'
                    className='scrollable-body'
                />
            </div>
        </div>
    );
}

export default HomePage;
