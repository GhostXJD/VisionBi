import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteUsuarioRequest, getUsuariosRequest, updateActiveRequest } from '../api/usuarios';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';

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

  const handleToggleActive = async (id, isActive) => {
    try {
      await updateActiveRequest(id, { active: !isActive });
      getUsuarios();
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
  };

  return (
    <div className="mx-auto my-5">
      {usuarios.length > 0 ? (
        <DataGrid
          rows={usuarios.map((usuario) => ({
            id: usuario._id,
            rut: usuario.rut,
            nombre: usuario.nombre,
            correo: usuario.correo,
            compania: usuario.company,
            tipoUsuario: usuario.tipoUsuario,
            estado: usuario.active,
          }))}
          columns={[
            { field: 'rut', headerName: 'Rut', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'nombre', headerName: 'Nombre', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'correo', headerName: 'E-mail', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'compania', headerName: 'Compañia', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'tipoUsuario', headerName: 'Tipo usuario', flex: 1, headerClassName: 'custom-header-class' },
            {
              field: 'estado',
              headerName: 'Estado',
              renderCell: (params) => (
                <Checkbox
                  checked={params.row.estado}
                  onChange={() => handleToggleActive(params.row.id, params.row.estado)}
                />
              ),
            },
            {
              field: 'actions',
              headerName: 'Acciones',
              renderCell: (params) => (
                <>
                  <IconButton onClick={() => handleDeleteUsuario(params.row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              ),
            },
          ]}
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
