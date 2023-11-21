import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getcompaniesRequest } from '../api/company';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';

function ListarCompaniaPage() {
    const [companies, setCompanies] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = '/';
        }
    }, [isAuthenticated]);

    useEffect(() => {
        getCompanies();
    }, []);

    const getCompanies = async () => {
        try {
            const res = await getcompaniesRequest();
            setCompanies(res.data);
            console.log('companies', res.data)
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    return (
        <div className="mx-auto my-5">
      {companies.length > 0 ? (
        <DataGrid
          rows={companies.map((company) => ({
            id: company._id,
            businessRut: company.businessRut,
            businessName: company.businessName,
            representante: company.agent,
          }))}
          columns={[
            { field: 'businessRut', headerName: 'Rut compañia', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'businessName', headerName: 'Nombre compañia', flex: 1, headerClassName: 'custom-header-class' },
            { field: 'representante', headerName: 'Representante compañia', flex: 1, headerClassName: 'custom-header-class' },
          ]}
          pageSize={5}
          autoHeight
          rowHeight={40}
          headerClassName="sticky-header"
          className="scrollable-body"
        />
      ) : (
        <h1>No hay compañias</h1>
      )}
    </div>
    )
}

export default ListarCompaniaPage
