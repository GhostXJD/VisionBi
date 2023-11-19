import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Footer({ hiddenRoutes }) {
    const { pathname } = useLocation();
    if (hiddenRoutes.find((hiddenRoute) => pathname == hiddenRoute)) {
        return
    }
    return (
        <div>
            <section className="footer">
                <div className="box-footer">
                    <div className="box">
                        <h3>Contacto</h3>
                        <Link><a> <i><LocalPhoneRoundedIcon /></i> +56 2 2789 5411 </a></Link>
                        <Link><a> <i><PhoneAndroidRoundedIcon /></i> +56 9 4245 6139 </a></Link>
                        <Link to='/contactus'><a><i><EmailRoundedIcon /></i> Contactanos </a></Link>
                    </div>

                    <div className="box">
                        <h3>Acerca de</h3>
                        <Link to='/aboutus'><a><i></i>Sobre nosotros</a></Link>
                        <Link to='/mission'><a><i></i>Misión</a></Link>
                        <Link to='/vision'><a><i></i>Visión</a></Link>
                    </div>

                    <div className="box">
                        <h3>Siguenos</h3>
                        <Link><a><i><FacebookRoundedIcon /></i> VisionBI </a></Link>
                        <Link><a><i><TwitterIcon /></i> @visionBI </a></Link>
                        <Link><a><i><InstagramIcon /></i> @visionBI </a></Link>
                    </div>
                </div>
                <div className="credit"><p>&copy; 2023 <span>Vision BI</span> All right reserved.</p>
                </div>
            </section>
        </div>
    )
}