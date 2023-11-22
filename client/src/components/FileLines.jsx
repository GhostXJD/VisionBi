import { Button, Dialog, Container, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const FileLines = (props) => {

    return (
        <Container maxWidth="lg" style={{ marginTop: '70px' }}>
            {props.open && (
                <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="md">
                    <DialogTitle style={{ marginTop: "5px", marginBottom: "20px", fontSize: "bold", color: "black" }}>
                        <h1 style={{ marginBottom: '15px' }}> <DescriptionRoundedIcon sx={{ fontSize: 45 }} /> Formato CSV</h1>
                        <div className="box-file">
                            <p>Para cargar tu historial de ventas, puedes utilizar un archivo CSV (Valores Separados por Comas) que incluya la siguiente información:</p>

                            <ul> • Pedido (Order): Este campo registra el número único asociado con cada transacción de compra.</ul>

                            <ul> • Fecha (Date): Indica la fecha en que ocurrió la venta.</ul>

                            <ul> • Categoría (Category): Describe la categoría o tipo de producto vendido en esa transacción. </ul>

                            <ul> • Cantidad (Quantity): Refleja la cantidad de productos vendidos en ese pedido de compra. </ul>

                            <ul> • Precio (SKU Value): Representa el precio unitario de cada producto vendido. </ul>

                            <ul> • Región (State): Se refiere a la región geográfica o ubicación donde tuvo lugar la venta. </ul>

                            <ul> • Cuidad (Neighborhood): Especifica la área geográfica más pequeña donde ocurrió la transacción. </ul>

                            <ul> • Total por Pedido (Total Value): Representa el precio total de una venta por pedido. </ul>

                            <p>Para completar este proceso, simplemente carga un archivo CSV que contenga esta información. Esto te permitirá analizar y gestionar tu historial de ventas de manera eficiente y efectiva.</p>
                        </div>

                        <Button fullWidth size="large" sx={{ mt: 3 }} color="secondary" type="submit" variant="contained" >
                            OK
                        </Button>

                    </DialogTitle>
                </Dialog>
            )}
        </Container>
    )
}

export default FileLines;