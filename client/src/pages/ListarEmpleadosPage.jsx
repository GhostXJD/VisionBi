import * as React from 'react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { getUsuariosRequest } from '../api/usuarios';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../context/AuthContext'

export default function DataTable() {
    const [usuarios, setUsuarios] = useState([]);
    const { isAuthenticated, usuario } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) navigate('/inicio')
    }, [isAuthenticated])

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        try {
            const res = await getUsuariosRequest();
            const usuarios = res.data.filter(
                (user) => user.company === usuario.company
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
        { field: 'correo', headerName: 'Correo', width: 150 },
        { field: 'active', headerName: 'Active', width: 90 },
        { field: 'company', headerName: 'Company', width: 90 },
    ];

    return (
        <div>
            <Navbar />
            <div style={{ height: 800, width: '100%', backgroundColor: 'white' }}>
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
        </div>
    );
}