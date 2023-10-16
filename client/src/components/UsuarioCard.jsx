import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete'; 

function UsuarioCard({ usuario, onDeleteUsuario }) {

  const handleDeleteClick = () => {
    onDeleteUsuario(usuario._id);
  };

  return (
    <div className="bg-zinc-200 text-whitemax-w-md w-full p-10 rounded-md">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">{usuario.nombre}</h1>
        <div className="flex gap-x-2 items-center">
          <button
            className="border border-cyan-500 hover:border-cyan-300 bg-transparent px-4 py-1 rounded-md text-cyan-500 hover:text-cyan-300">
            <EditNoteIcon />
          </button>

          <button
            className="border border-red-500 hover:border-red-300 bg-transparent px-4 py-1 rounded-md text-red-500 hover:text-red-300"onClick={handleDeleteClick}>
            <DeleteIcon />
          </button>
        </div>
      </header>
      <p className="text-gray-500">Rut: {usuario.rut}</p>
      <p className="text-gray-500">E-mail: {usuario.correo}</p>
      <p className="text-gray-500">Job: {usuario.tipoUsuario}</p>
    </div>
  )
}

export default UsuarioCard;

