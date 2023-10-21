import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Footer({hiddenRoutes}){
    const {pathname}=useLocation();
    if (hiddenRoutes.find((hiddenRoute) => pathname == hiddenRoute)) {
        return 
    }
return (
    <div>
        <section class="footer">
            <div class="box-footer">
                <div class="box">
                    <h3>Contact</h3>
                    <Link><a> <i><LocalPhoneRoundedIcon /></i> +56 2 2789 5411 </a></Link>
                    <Link><a> <i><PhoneAndroidRoundedIcon /></i> +56 9 4245 6139 </a></Link>
                    <Link to='/contactus'><a><i><EmailRoundedIcon /></i> Contact Us </a></Link>
                </div>

                <div class="box">
                    <h3>About</h3>
                    <Link to='/aboutus'><a><i></i>About us</a></Link>
                    <Link to='/mission'><a><i></i>Mission</a></Link>
                    <Link to='/vision'><a><i></i>Vision</a></Link>
                </div>

                <div class="box">
                    <h3>Follow Us</h3>
                    <Link><a><i><FacebookRoundedIcon /></i> VisionBI </a></Link>
                    <Link><a><i><TwitterIcon /></i> @visionBI </a></Link>
                    <Link><a><i><InstagramIcon /></i> @visionBI </a></Link>
                </div>
            </div>
            <div class="credit"> &copy; created by <span>visionBI</span> | all right reserved </div>
        </section>
    </div>
)
};