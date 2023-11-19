import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessagesRequest } from '../api/messages';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";

function ListarMenssage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [msgs, setMessages] = useState([]);

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
            console.error("Error al obtener mensajes:", error);
        }
    };

    return (
        <div className='uploadFile'>
            <div className='file'>
                <DataGrid
                    rows={msgs.map((msg) => ({
                        id: msg._id,
                        nombre: msg.nombre,
                        correo: msg.correo,
                        message: msg.message,
                        status: msg.status ? 'Por revisar' : 'Revisado',
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
                            renderCell: (msg) => (
                                <Link to={`/message/${msg.row.id}`}>
                                    <IconButton
                                        onClick={() => {
                                        }}
                                        disableRipple
                                    >
                                        <EditIcon sx={{ fontSize: '1.5rem', color: '#8F3C8A' }} />
                                    </IconButton>
                                </Link>
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