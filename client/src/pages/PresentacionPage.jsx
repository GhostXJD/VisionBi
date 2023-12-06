import bannerVBI from "../images/bannerVBI.png";
import comparativas from "../images/comparativas.png";
import graficos from "../images/graficos.png";
import predicciones from "../images/predicciones.png";
import csv from "../images/csv.png";
import { Link } from "react-router-dom";


function PresentationPage() {
    return (
        <section>
            <div className="index">
                <div className="index-banner">
                    <div className="presentation">
                        <h3>Transformar datos en estrategia</h3>
                        <p>La Inteligencia Empresarial es la clave de nuestro éxito. Somos
                            dedicado a aprovechar la inteligencia empresarial para hacer
                            decisiones informadas y estratégicas que nos permitan
                            innovar y crear soluciones excepcionales.</p>
                        <div className='index-btn'>
                            <Link to='/registro' >Únete a nosotros</Link>
                        </div>
                    </div>
                    <div className="">
                        <img src={bannerVBI} alt="bannerVBI" className='banner-img' />
                    </div>
                </div>

            </div>
            <div className="services">
                <h3>SERVICIOS</h3>
                <div className="index-info" >
                    <div className="box-services">
                        <img src={comparativas} alt="comparativas" className='services-img' />
                        <h2>COMPARACIONES</h2>
                        <p className='dark:text-black'>Evaluamos sus objetivos de ventas y los comparamos con sus cifras de ventas reales. Obtenga una comprensión clara de su desempeño en relación con sus objetivos y tome decisiones basadas en datos.</p>
                    </div>
                    <div className="box-services">
                        <img src={predicciones} alt="predicciones" className='services-img' />
                        <h2>PREDICCIÓN</h2>
                        <p className='dark:text-black'>Basándonos en su historial de ventas, generamos pronósticos precisos para sus ventas durante los próximos seis meses. Utilice esta información para planificar sus operaciones, ajustar su inventario y tomar medidas proactivas para optimizar sus resultados.</p>
                    </div>
                    <div className="box-services">
                        <img src={graficos} alt="graficos" className='services-img' />
                        <h2>GRÁFICOS</h2>
                        <p className='dark:text-black'>Visualiza el movimiento de tus ventas de forma intuitiva a través de gráficos interactivos. Observe tendencias, patrones estacionales y cambios en sus datos de ventas para tomar decisiones estratégicas e informadas.</p>
                    </div>
                </div>
            </div>
            <div className="file">
                <h3>Sube los datos de tu historial</h3>
                <div className="index-file" >
                    <div className="box-file">
                        <img src={csv} alt="csv" className='file-img' />
                    </div>
                    <div className="box-file">
                        <p>Para cargar tu historial de ventas, puedes utilizar un archivo CSV (Valores Separados por Comas) que incluya la siguiente información:</p>
                        <ul> • Pedido: Este campo registra el número único asociado con cada transacción de compra.</ul>
                        <ul> • Fecha: Indica la fecha en que ocurrió la venta.</ul>

                        <ul> • Categoría: Describe la categoría o tipo de producto vendido en esa transacción. </ul>

                        <ul> • Cantidad: Refleja la cantidad de productos vendidos en ese pedido de compra. </ul>

                        <ul> • Precio: Representa el precio unitario de cada producto vendido. </ul>

                        <ul> • Estado: Se refiere a la región geográfica o ubicación donde tuvo lugar la venta. </ul>

                        <ul> • Vecindario: Especifica la área geográfica más pequeña donde ocurrió la transacción. </ul>

                        <ul> • Total por Pedido: Representa el precio total de una venta por pedido. </ul>
                        <p>Para completar este proceso, simplemente carga un archivo CSV que contenga esta información. Esto te permitirá analizar y gestionar tu historial de ventas de manera eficiente y efectiva.</p>
                    </div>
                </div>
            </div>

        </section>

    );
}

export default PresentationPage;