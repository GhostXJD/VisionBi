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
                <h3>SERIVICOS</h3>
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
                        <p>To upload your sales history, you can use a CSV file (Comma-Separated Values) that includes the following information:</p>
                        <ul> • Order: This field records the unique number associated with each purchase transaction.</ul>
                        <ul> • Date: Indicates the date on which the sale occurred.</ul>

                        <ul> • Category: Describes the category or type of product sold in that transaction.</ul>

                        <ul> • Quantity: Reflects the quantity of products sold in that purchase order.</ul>

                        <ul> • Price: Represents the unit price of each product sold.</ul>

                        <ul> • State: Refers to the geographical region or location where the sale took place.</ul>

                        <ul> • Neighborhood: Specifies the smaller geographic area where the transaction occurred.</ul>

                        <ul> • Total by Order: Represents the totsl price of an order sale.</ul>
                        <p>To complete this process, simply upload a CSV file containing this information. This will enable you to analyze and manage your sales history efficiently and effectively.</p>
                    </div>
                </div>
            </div>

        </section>

    );
}

export default PresentationPage;