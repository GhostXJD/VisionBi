import { useState, useEffect } from 'react';
import { getUsuariosRequest } from '../api/usuarios';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../context/AuthContext'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

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

    const columns = [
        { field: 'rut', headerName: 'Rut', width: 110 },
        { field: 'nombre', headerName: 'Name', width: 150 },
        { field: 'apellido', headerName: 'Last name', width: 110 },
        { field: 'correo', headerName: 'Correo', width: 200 },
        { field: 'active', headerName: 'Active', width: 90 },
        { field: 'company', headerName: 'Company', width: 150 },
    ];

    return (
            <div style={{ height: 600, width: '100%', backgroundColor: 'white', marginTop: '60px' }}>
                <h1 style={{ marginBottom: '30px' }}>
                    <PeopleAltRoundedIcon sx={{ fontSize: 45 }}/> Your Employees
                </h1>
                <DataGrid
                    rows={usuarios.map((user, index) =>({
                        id: index + 1,
                        rut: user.rut,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        correo: user.correo,
                        active: user.active,
                        company: user.company
                    }))}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
    );
}