import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MessageIcon from '@mui/icons-material/Message';
import { getMessageRequest } from '../api/messages';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { updateMessageRequest } from '../api/messages';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Swal from 'sweetalert2'

function message() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated]);
  useEffect(() => {
    async function loadMessage() {
      if (params.id) {
        const res = await getMessageRequest(params.id)
        const mensaje = res.data
        setMsg(mensaje)
      }
    }
    loadMessage();
  }, [])

  const formik = useFormik({
    initialValues: {
        status: ''
    },
    validationSchema: Yup.object({
        status: Yup
            .boolean()
    }),

    onSubmit: async (values, helpers) => {
        try {

            const msgData = {
                status: values.status,
            }
            await updateMessageRequest(msgData)
            props.handleClose()
            Swal.fire({
                icon: 'success',
                text: 'Estado Actualizado',
                confirmButtonColor: '#8F3C8A',
            }).then(() => {
                window.location.replace('/ListarMensajes');
            });
        } catch (err) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
        }
    }
});

  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <div className={`relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto  bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-zinc-800 dark:text-white dark:!shadow-none p-3`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(207, 195, 218, 0.7)', backgroundColor: '#fffdfe' }}>
        <div className="perfil">
          <h4>
            <MessageIcon sx={{ fontSize: 45 }} /> Mensaje
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 w-full">
          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
            <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Nombre</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {msg.nombre}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 w-full">
          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
            <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Correo</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {msg.correo}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 w-full">
          <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
            <p className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Mensaje</p>
            <p className="text-base font-medium text-zinc-700 dark:text-white">
              {msg.message}
            </p>
          </div>
        </div>
        <FormControl fullWidth>

          <div className="grid grid-cols-1 gap-4 px-2 w-full">
            <div className={`flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-zinc-700 dark:shadow-none`} style={{ border: '2px  #c1b9c7', borderRadius: '5px', boxShadow: '0 0 10px rgba(247, 240, 246, 0.7)' }}>
              <InputLabel className="text-sm font-bold" style={{ color: '#8F3C8A' }}>Estado</InputLabel>
              <Select label="Estado" value={msg.status} color='secondary'  >
                <MenuItem>Estado</MenuItem>
              </Select>
            </div>
          </div>
        </FormControl>

        <div className="justify-center items-center py-3">
          <li className='bg-[#8F3C8A] px-3 py-1 rounded-lg h-8 scale-x-95 text-white '>
            <Link to='ChangePassword'>Actualizar</Link>
          </li>
        </div>
      </div>
    </div>

  )
}

export default message
