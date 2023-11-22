import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { getUsuarioRequest, updateTypeRequest } from '../api/usuarios';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Swal from 'sweetalert2'

function EditarUsuarioPage() {
    const { isAuthenticated } = useAuth();
    const params = useParams();
    const [usuario, setUsuario] = useState([]);
    const [selectedTipoUsuario, setSelectedTipoUsuario] = useState('');

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    useEffect(() => {
        async function loadUser() {
            if (params.id) {
                const res = await getUsuarioRequest(params.id);
                const usuario = res.data;
                setUsuario(usuario);
                setSelectedTipoUsuario(usuario.tipoUsuario);
            }
        }
        loadUser();
    }, [params.id]);

    const formik = useFormik({
        initialValues: {
            tipoUsuario: selectedTipoUsuario,
        },
        validationSchema: Yup.object({
            tipoUsuario: Yup
                .string()
                .required('Se requiere tipo usuario'),
        }),

        onSubmit: async (values, helpers) => {
            try {

                const usuarioData = {
                    tipoUsuario: selectedTipoUsuario,
                };

                await updateTypeRequest(usuario._id, usuarioData);
                Swal.fire({
                    icon: 'success',
                    text: 'Usuario Actualizado',
                    confirmButtonColor: '#8F3C8A',
                }).then(() => {
                    window.location.replace('/ListarUsuarios');
                });
            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
            <div className={`relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto  bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-800 dark:text-white dark:!shadow-none p-3`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(207, 195, 218, 0.7)', backgroundColor: '#fffdfe' }}>
                <div className="perfil">
                    <h4>
                        <EditIcon sx={{ fontSize: 45 }} /> Editar tipo de usuario
                    </h4>
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 w-full">
                    <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
                        <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Rut</p>
                        <p className="text-base font-medium text-zinc-700 dark:text-white">
                            {usuario.rut}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 w-full">
                    <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
                        <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Nombre</p>
                        <p className="text-base font-medium text-zinc-700 dark:text-white">
                            {usuario.nombre}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 w-full">
                    <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
                        <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Correo</p>
                        <p className="text-base font-medium text-zinc-700 dark:text-white">
                            {usuario.correo}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 w-full">
                    <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
                        <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Correo</p>
                        <p className="text-base font-medium text-zinc-700 dark:text-white">
                            {usuario.company}
                        </p>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 px-2 w-full">
                        <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
                            <InputLabel className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Tipo usuario</InputLabel>
                            <Select
                                label="Tipo usuario"
                                value={selectedTipoUsuario}
                                onChange={(e) => {
                                    setSelectedTipoUsuario(e.target.value);
                                    formik.setFieldValue('tipoUsuario', e.target.value);
                                }}
                                name="tipoUsuario"
                                color='secondary'
                            >
                                <MenuItem value="representante">Representante</MenuItem>
                                <MenuItem value="empleado">Empleado</MenuItem>
                            </Select>
                        </div>
                        <Button
                            fullWidth
                            size="large"
                            sx={{
                                mt: 3,
                                backgroundColor: '#8F3C8A',
                                '&:hover': {
                                    backgroundColor: '#b57edc',
                                },
                            }}
                            type="submit"
                            variant="contained"
                            color="success"
                        >
                            Actualizar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditarUsuarioPage
