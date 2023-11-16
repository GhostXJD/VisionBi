import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../context/AuthContext';
import { useCsv } from '../context/CsvContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessagesRequest } from '../api/messages';
import Papa from 'papaparse';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import Swal from 'sweetalert2'
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function ListarMenssage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
        getMensaje();
    }, [isAuthenticated]);

    const getMensaje = async () => {
        try {
          const res = await getMessagesRequest();
          const mensajes = res.data
          setMessages(mensajes);
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      };

    const onSubmit = async (event) => {
        try {
            getMensaje();
        } catch (error) {
            console.error("Error al subir el archivo CSV:", error);
        }
    };


    return (
        <div className='uploadFile'>
            <div className='file'>
                <DataGrid
                    rows={messages.map((message, index) => ({
                        id: index,
                        nombre: message.nombre,
                        correo: message.correo,
                        message: message.message,
                        status: message.status ? 'Por revisar' : 'Revisado',
                    }))}
                    columns={[
                        { field: 'nombre', headerName: 'Nombre', flex: 1, headerClassName: 'custom-header-class' },
                        { field: 'correo', headerName: 'Correo', flex: 1, headerClassName: 'custom-header-class' },
                        { field: 'message', headerName: 'Mensaje', flex: 1, headerClassName: 'custom-header-class' },
                        { field: 'status', headerName: 'Estado', flex: 1, headerClassName: 'custom-header-class' },
                        {
                            field: 'accion',
                            headerName: 'Acción',
                            flex: 1,
                            headerClassName: 'custom-header-class',
                            renderCell: (params) => (
                                <IconButton
                                    onClick={() => {
                                    }}
                                    disableRipple
                                >
                                    <EditIcon sx={{ fontSize: '1.5rem', color: '#8F3C8A' }} /> 
                                </IconButton>
                            ),
                        },
                    ]}
                    pageSize={5}
                    headerClassName='sticky-header'
                    className='scrollable-body'
                />
            </div>
        </div>
    );
}

export default ListarMenssage;