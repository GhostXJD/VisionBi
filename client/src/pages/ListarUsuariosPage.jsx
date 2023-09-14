import { useState } from 'react'
import { useEffect } from "react";
import {getUsuariosRequest} from '../api/usuarios'

function ListarUsuariosPage() {

    const [usuarios, setUsuarios] = useState([]);

    useEffect(()=>{

        getUsuarios();
    }, [])

    const getUsuarios = async () =>{
        const res = await getUsuariosRequest()
        const usuarios = res.data.filter(usuario => (usuario.tipoUsuario === 'empresa' || usuario.tipoUsuario ==='empleado') && usuario.active === true);
        console.log("usuarios",usuarios);
        setUsuarios(usuarios)
    };

    if (usuarios.length === 0) return (<h1>No hay usuarios</h1>)
    
    return (
      <div>
          {
          usuarios.map(usuario => (
            <div key={usuario._id}>
                <h1>{usuario.nombre}</h1>
                <h1>{usuario.rut}</h1>
                <h1>{usuario.correo}</h1>
                <h1>{usuario.tipoUsuario}</h1>
            </div>
          ))
          }
      </div>
    )
  }
  
  export default ListarUsuariosPage
  