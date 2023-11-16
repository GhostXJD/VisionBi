import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    TableSortLabel,
    Button,
    Paper,
    styled, // Importa styled desde @mui/material
} from '@mui/material';

// Estilos personalizados para el contenedor de la tabla usando 'styled'
const StyledTableContainer = styled(Paper)({
    maxHeight: 400, // Define la altura máxima que desees
    overflow: 'auto', // Agrega scroll cuando sea necesario
    '& table': {
        minWidth: 650,
    },
    '&::-webkit-scrollbar': {
        width: '1rem',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'var(--white)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#8F3C8A',
      },
});

// Estilos para el encabezado fijo
const StyledTableHead = styled(TableHead)({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: '#fff', // Puedes ajustar el color de fondo según tu diseño
});

function Messages() {
    const { isAuthenticated, usuario } = useAuth();
    const [messagesData, setMessagesData] = useState([
        { id: 1, nombre: 'Alice Johnson', correo: 'alice@example.com', mensaje: 'Hola, ¿cómo estás?' },
        { id: 2, nombre: 'Bob Smith', correo: 'bob@example.com', mensaje: '¡Bien, gracias!' },
        { id: 3, nombre: 'Charlie Brown', correo: 'charlie@example.com', mensaje: '¿Qué tal tu día?' },
        { id: 4, nombre: 'David Lee', correo: 'david@example.com', mensaje: 'Estoy ocupado, pero bien.' },
        { id: 5, nombre: 'Emma Davis', correo: 'emma@example.com', mensaje: '¿Alguna novedad?' },
        { id: 6, nombre: 'Frank Wilson', correo: 'frank@example.com', mensaje: 'No mucho, ¿y tú?' },
        { id: 7, nombre: 'Grace Taylor', correo: 'grace@example.com', mensaje: 'Solo trabajando duro.' },
        { id: 8, nombre: 'Henry Martinez', correo: 'henry@example.com', mensaje: 'Entiendo, ¡buena suerte!' },
        { id: 9, nombre: 'Isabella White', correo: 'isabella@example.com', mensaje: 'Gracias, lo necesitaré.' },
        { id: 11, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 12, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 13, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 14, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 15, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 16, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 17, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 18, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 19, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 20, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 21, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 22, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 23, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 24, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 25, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 26, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 27, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 28, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 29, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 30, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 31, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 32, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 33, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 34, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 35, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 36, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 37, nombre: 'Jack Harris', correo: 'jack@example.com', mensaje: '¡Hasta luego!' },
        { id: 38, nombre: 'Sophia Clark', correo: 'sophia@example.com', mensaje: '¡Adiós por ahora!' },
        { id: 39, nombre: 'Thomas Adams', correo: 'thomas@example.com', mensaje: '¡Hasta pronto!' },
        { id: 40, nombre: 'Victoria Moore', correo: 'victoria@example.com', mensaje: '¡Que tengas un buen día!' },
    ]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('nombre');
    const [order, setOrder] = useState('asc');

    const handleSort = (property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = messagesData.sort((a, b) => {
        const isAscending = order === 'asc' ? 1 : -1;
        if (a[orderBy] < b[orderBy]) return -1 * isAscending;
        if (a[orderBy] > b[orderBy]) return 1 * isAscending;
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Redirige al usuario a la página de inicio si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    return (
        <div>
            <TableContainer component={StyledTableContainer}>
                <Table>
                    <StyledTableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'nombre'}
                                    direction={orderBy === 'nombre' ? order : 'asc'}
                                    onClick={() => handleSort('nombre')}
                                >
                                    Nombre Completo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'correo'}
                                    direction={orderBy === 'correo' ? order : 'asc'}
                                    onClick={() => handleSort('correo')}
                                >
                                    Correo
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Mensaje</TableCell>
                            <TableCell>Responder</TableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {paginatedData.map((message) => (
                            <TableRow key={message.id}>
                                <TableCell>{message.nombre}</TableCell>
                                <TableCell>{message.correo}</TableCell>
                                <TableCell>{message.mensaje}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary">
                                        Responder
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </div>
    );
}

export default Messages;
