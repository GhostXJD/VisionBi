import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteUsuarioRequest, getUsuariosRequest } from '../api/usuarios';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ListarUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      const usuarios = res.data.filter(
        (usuario) => usuario.tipoUsuario === 'representante' || usuario.tipoUsuario === 'empleado'
      );
      setUsuarios(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleDeleteUsuario = async (id) => {
    try {
      const res = await deleteUsuarioRequest(id);
      console.log(res);
      Swal.fire({
        icon: 'success',
        text: 'User deleted successfully',
        confirmButtonColor: '#8F3C8A',
      });
      getUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 110 },
    { field: 'nombre', headerName: 'Name', width: 200 },
    { field: 'rut', headerName: 'Rut', width: 200 },
    { field: 'correo', headerName: 'E-mail', width: 250 },
    { field: 'tipoUsuario', headerName: 'Job', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditUsuario(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteUsuario(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto my-5">
      {usuarios.length > 0 ? (
        <DataGrid
          rows={usuarios.map((usuario, index) => ({
            id: usuario._id, // Usar el id real del usuario
            ...usuario,
          }))}
          columns={columns}
          pageSize={5}
          autoHeight
          rowHeight={40}
          headerClassName="sticky-header"
          className="scrollable-body"
        />
      ) : (
        <h1>No hay usuarios</h1>
      )}
    </div>
  );
}

export default ListarUsuariosPage;
