import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteUsuarioRequest, getUsuariosRequest } from '../api/usuarios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

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
          <EditIcon onClick={() => handleEditUsuario(params.row.id)}>Edit</EditIcon>
          <RemoveCircleOutlineIcon onClick={() => handleDeleteUsuario(params.row.id)}></RemoveCircleOutlineIcon>
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto my5">
      {usuarios.length > 0 ? (
        <DataGrid
          rows={usuarios.map((usuario, index) => ({
            id: index + 1,
            ...usuario,
          }))}
          columns={columns}
          pageSize={5}
          autoHeight
          rowHeight={40} // Puedes ajustar este valor según tus preferencias
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
