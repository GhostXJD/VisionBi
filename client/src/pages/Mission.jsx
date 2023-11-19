import mision from "../images/Mision.png";

function AboutUs() {
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>MISIÓN</h3>
                        <p>Facilitar el éxito empresarial a través de soluciones innovadoras y precisas.
                            Nuestra misión es proporcionar a las empresas las herramientas necesarias para hacer
                            decisiones informadas y estratégicas, mejorando su desempeño y
                            crecimiento a través del análisis de datos y pronósticos precisos.</p>
                    </div>
                    <div className="presentation-photo">
                        <img src={mision} alt="mision" className='about-img' />
                    </div>
                </div>
            </div>
            <div className="about-info">

            </div>
        </section>
    );
}

export default AboutUs;