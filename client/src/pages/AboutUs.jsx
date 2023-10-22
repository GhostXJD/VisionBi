import aboutus from "../images/AboutUs.png";
import MiguelBadilla from "../images/MiguelBadilla.png";
import JavierDiaz from "../images/JavierDiaz.png";
import EstefaniNavarro from "../images/EstefaniNavarro.png";
import IgnacioRuiz from "../images/IgnacioRuiz.png";
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
                        <h3>About Us</h3>
                        <p>We are a group of computer engineering students at Duoc UC.
                            Since the first week of classes, we came together and have
                            functioned as a cohesive team, tackling every challenge
                            that has come our way. This collaborative approach has
                            been a consistent thread throughout our academic journey,
                            and it is particularly evident in our final endeavor:
                            the portfolio project. This project serves as the culmination,
                            showcasing our readiness to earn the title of computer engineers,
                            and we are committed to successfully surmounting this ultimate challenge.</p>
                    </div>
                    <div className="presentation-photo">
                        <img src={aboutus} alt="aboutus" className='about-img' />
                    </div>
                </div>
            </div>
            
            <div className="about-info">
                <h3>Great team is the key</h3>
                <div className="about-members">
                    <div className="box-members">
                        <Avatar className="avatar" alt="MiguelBadilla" src={MiguelBadilla} sx={{ width: 200, height: 200 }} />
                        <h2>Miguel Badilla</h2>
                        <p className='dark:text-black'>Computer engineering student</p>
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
                        <Avatar className="avatar" src={JavierDiaz} alt="JavierDiaz" sx={{ width: 200, height: 200 }} />
                        <h2>Javier Díaz</h2>
                        <p className='dark:text-black'>Computer engineering student</p>
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
                        <Avatar className="avatar" src={EstefaniNavarro} alt="EstefaniNavarro" sx={{ width: 200, height: 200 }} />

                        <h2>Estefani Navarro</h2>
                        <p className='dark:text-black'>Computer engineering student</p>
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
                        <Avatar className="avatar" src={IgnacioRuiz} alt="IgnacioRuiz" sx={{ width: 200, height: 200 }} />
                        <h2>Ignacio Ruiz</h2>
                        <p className='dark:text-black'>Computer engineering student</p>
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