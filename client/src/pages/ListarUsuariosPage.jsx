//TODO: Agregar diseño
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'
import { deleteUsuarioRequest, getUsuariosRequest } from '../api/usuarios';
import UsuarioCard from "../components/UsuarioCard";

function ListarUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const { isAuthenticated } = useAuth();

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
        (usuario) => usuario.tipoUsuario === 'representante' || usuario.tipoUsuario === 'empleado'
      );
      setUsuarios(usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleDeleteUsuario = async (id) => {
    try {
      const res = await deleteUsuarioRequest(id);
      console.log(res);
      getUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  if (usuarios.length === 0) return <h1>No hay usuarios</h1>;

  return (
      <div className='grid grid-cols-3 gap-2'>
        {usuarios.map((usuario) => (
          <UsuarioCard
            usuario={usuario}
            key={usuario._id}
            onDeleteUsuario={handleDeleteUsuario}
          />
        ))}
      </div>
  );
}

export default ListarUsuariosPage;