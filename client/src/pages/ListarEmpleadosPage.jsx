import { useState, useEffect } from 'react';
import { getUsuariosRequest, updateActiveRequest } from '../api/usuarios';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../context/AuthContext'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Checkbox from '@mui/material/Checkbox';

export default function DataTable() {
    const [usuarios, setUsuarios] = useState([]);
    const { isAuthenticated, usuario } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) navigate('/')
    }, [isAuthenticated])

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const res = await getUsuariosRequest();
            const usuarios = res.data.filter(
                (user) => user.company === usuario.company && user.tipoUsuario === 'empleado'
            );
            setUsuarios(usuarios);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    const handleToggleActive = async (id, isActive) => {
        try {
            await updateActiveRequest(id, { active: !isActive });
            getUsuarios();
        } catch (error) {
            console.error('Error al cambiar el estado del usuario:', error);
        }
    };

    return (
        <div style={{ height: 600, width: '100%', backgroundColor: 'white', marginTop: '60px' }}>
            <h1 style={{ marginBottom: '30px' }}>
                <PeopleAltRoundedIcon sx={{ fontSize: 45 }} /> Tus empleados
            </h1>
            <DataGrid
                rows={usuarios.map((user) => ({
                    id: user._id,
                    rut: user.rut,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo,
                    company: user.company,
                    estado: user.active
                }))}
                columns={[
                    { field: 'rut', headerName: 'Rut', flex: 1, headerClassName: 'custom-header-class' },
                    { field: 'nombre', headerName: 'Nombre', flex: 1, headerClassName: 'custom-header-class' },
                    { field: 'apellido', headerName: 'Apellido', flex: 1, headerClassName: 'custom-header-class' },
                    { field: 'correo', headerName: 'Correo', flex: 1, headerClassName: 'custom-header-class' },
                    { field: 'company', headerName: 'Compañia', flex: 1, headerClassName: 'custom-header-class' },
                    {
                        field: 'estado',
                        headerName: 'Estado',
                        headerClassName: 'custom-header-class' ,
                        renderCell: (params) => (
                          <Checkbox
                            checked={params.row.estado}
                            onChange={() => handleToggleActive(params.row.id, params.row.estado)}
                          />
                        ),
                      },
                ]}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        </div>
    );
}