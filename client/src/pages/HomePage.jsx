import Navbar from '../components/Navbar';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../context/AuthContext';
import { useCsv } from '../context/CsvContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        if (!isAuthenticated) navigate('/inicio');
    }, [isAuthenticated]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setArchivoCSV(file);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = {
        archivoCSV: archivoCSV,
        userUploader: usuario.rut,
        company: usuario.company,
        };
        
        console.log("formData", formData)
        createCsv(formData);
    };

    return (
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
                        />
                    </Button>
                    <div className='p-2'>
                        <Button type="submit" variant="contained" color="success">Subir CSV</Button>
                    </div>
                </form>
            </div>
    );
}

export default HomePage;