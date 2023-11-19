import vision from "../images/Vision.png";

function AboutUs() {
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>VISIÓN</h3>
                        <p>Ser reconocidos como líderes en el campo del análisis de datos y
                            predicción de ventas. Nuestra visión es empoderar a las empresas en todo el mundo,
                            ayudándolos a alcanzar su máximo potencial, optimizar sus operaciones,
                            y convertir sus datos en ventajas competitivas. Nuestro objetivo es ser el
                            socio confiable para empresas que aspiran a una vida más exitosa y
                            futuro sostenible.</p>
                    </div>
                    <div className="presentation-photo">
                        <img src={vision} alt="vision" className='about-img' />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;