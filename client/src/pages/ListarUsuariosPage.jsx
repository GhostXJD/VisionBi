import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsuariosRequest, updateActiveRequest } from '../api/usuarios';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';

function ListarUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchRut, setSearchRut] = useState(''); // Nuevo estado para el RUT de búsqueda
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
      const filteredUsuarios = res.data.filter(
        (usuario) => usuario.tipoUsuario === 'representante' || usuario.tipoUsuario === 'empleado'
      );
      setUsuarios(filteredUsuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
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

  const filterUsuariosByCompanyRut = (rut) => {
    const filtered = usuarios.filter((usuario) =>
      usuario.company.toLowerCase().includes(rut.toLowerCase())
    );
    return filtered;
  };

  const handleSearchInputChange = (event) => {
    setSearchRut(event.target.value);
  };

  const filteredByCompanyRut = searchRut ? filterUsuariosByCompanyRut(searchRut) : usuarios;

  return (
    <div className="mx-auto my-5">
      <input
        type="text"
        placeholder="Buscar por RUT de la compañía"
        value={searchRut}
        onChange={handleSearchInputChange}
      />
      {filteredByCompanyRut.length > 0 ? (
        <DataGrid
          rows={filteredByCompanyRut.map((usuario) => ({
            id: usuario._id,
            rut: usuario.rut,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            compania: usuario.company,
            tipoUsuario: usuario.tipoUsuario,
            estado: usuario.active,
          }))}
          columns={[
            { field: 'rut', headerName: 'Rut', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'nombre', headerName: 'Nombre', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'apellido', headerName: 'Apellido', flex: 1, headerClassName: 'custom-header-class' },
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
          ]}
          pageSize={5}
          autoHeight
          rowHeight={40}
          headerClassName="sticky-header"
          className="scrollable-body"
        />
      ) : (
        <h1>No hay compañia con ese RUT</h1>
      )}
    </div>
  );
}

export default ListarUsuariosPage;
