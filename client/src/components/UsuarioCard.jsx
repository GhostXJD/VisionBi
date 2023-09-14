function UsuarioCard({ usuario, onDeleteUsuario }) {

  const handleDeleteClick = () => {
    onDeleteUsuario(usuario._id);
  };

  return (
    <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">{usuario.nombre}</h1>
        <div className="flex gap-x-2 items-center">
          <button className="bg-red-500 px-4 py-1 rounded-sm" onClick={handleDeleteClick}>Eliminar</button>
          <button className="bg-cyan-500 px-4 py-1 rounded-sm">Editar</button>
        </div>
      </header>
      <p className="text-slate-300">{usuario.rut}</p>
      <p className="text-slate-300">{usuario.correo}</p>
      <p className="text-slate-300">{usuario.tipoUsuario}</p>
    </div>
  )
}

export default UsuarioCard;

