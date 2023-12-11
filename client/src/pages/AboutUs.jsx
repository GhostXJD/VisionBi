import aboutus from "../images/AboutUs.png";
import Miguel from "../images/Miguel.jpg";
import Javier from "../images/Javier.jpg";
import Estefani from "../images/Estefani.jpg";
import Ignacio from "../images/Ignacio.jpg";

import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/instagram'
import 'react-social-icons/github'
import 'react-social-icons/linkedin'
import Avatar from '@mui/material/Avatar';

function AboutUs() {
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>Sobre Nosotros</h3>
                        <p>Somos un grupo de estudiantes de ingeniería informática en Duoc UC.
                            Desde la primera semana de clases, nos unimos y hemos
                            funcionado como un equipo cohesionado, enfrentando cada desafío
                            que se nos ha presentado. Este enfoque colaborativo ha sido
                            un hilo conductor constante a lo largo de nuestro viaje académico,
                            y es particularmente evidente en nuestro proyecto final:
                            el proyecto del portafolio. Este proyecto sirve como la culminación,
                            mostrando nuestra preparación para obtener el título de ingenieros informáticos,
                            y estamos comprometidos a superar con éxito este desafío final.</p>
                    </div>
                    <div className="presentation-photo">
                        <img src={aboutus} alt="aboutus" className='about-img' />
                    </div>
                </div>
            </div>
            
            <div className="about-info">
                <h3>Un gran equipo es la clave</h3>
                <div className="about-members">
                    <div className="box-members">
                        <Avatar className="avatar" alt="MiguelBadilla" src={Miguel} sx={{ width: 200, height: 200 }} />
                        <h2>Miguel Badilla</h2>
                        <p className='dark:text-black'>Estudiante de ingeniería informática</p>
                        <div className="redes">
                            <div>
                                <a href="https://www.instagram.com/mmigueell__/" ><SocialIcon className="red-logo" network="instagram" /></a>
                            </div>
                            <div>
                                <a href="https://github.com/newmoss" ><SocialIcon className="red-logo" network="github" /></a>
                            </div>
                            <div>
                                <a href="https://www.linkedin.com/in/miguelbadilla/" ><SocialIcon className="red-logo" network="linkedin" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="box-members">
                        <Avatar className="avatar" src={Javier} alt="JavierDiaz" sx={{ width: 200, height: 200 }} />
                        <h2>Javier Díaz</h2>
                        <p className='dark:text-black'>Estudiante de ingeniería informática</p>
                        <div className="redes">
                            <div>
                                <a href="https://www.instagram.com/aliensutro/" ><SocialIcon network="instagram" /></a>
                            </div>
                            <div>
                                <a href="https://github.com/GhostXJD" ><SocialIcon network="github" /></a>
                            </div>
                            <div>
                                <a href="https://www.linkedin.com/in/javierdiaziturra/" ><SocialIcon network="linkedin" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="box-members">
                        <Avatar className="avatar" src={Estefani} alt="EstefaniNavarro" sx={{ width: 200, height: 200 }} />

                        <h2>Estefani Navarro</h2>
                        <p className='dark:text-black'>Estudiante de ingeniería informática</p>
                        <div className="redes">
                            <div>
                                <a href="https://www.instagram.com/steffieess/"><SocialIcon network="instagram" /></a>
                            </div>
                            <div>
                                <a href="https://github.com/steffieess"><SocialIcon network="github" /></a>
                            </div>
                            <div>
                                <a href="https://www.linkedin.com/in/est-navarro/"><SocialIcon network="linkedin" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="box-members">
                        <Avatar className="avatar" src={Ignacio} alt="IgnacioRuiz" sx={{ width: 200, height: 200 }} />
                        <h2>Ignacio Ruiz</h2>
                        <p className='dark:text-black'>Estudiante de ingeniería informática</p>
                        <div className="redes">
                            <div>
                                <a href="https://instagram.com/http._ign_.rs/"><SocialIcon network="instagram" /></a>
                            </div>
                            <div>
                                <a href="https://github.com/GxStyle"><SocialIcon network="github" /></a>
                            </div>
                            <div>
                                <a href="https://cl.linkedin.com/in/ig-ruizs"><SocialIcon network="linkedin" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
