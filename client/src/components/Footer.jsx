import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';

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
                    <a href="#"> <i><LocalPhoneRoundedIcon /></i> +56 2 2789 5411 </a>
                    <a href="#"> <i><PhoneAndroidRoundedIcon /></i> +56 9 4245 6139 </a>
                    <a href="#"> <i><EmailRoundedIcon /></i> teamvisionbi@gmail.com </a>
                </div>

                <div class="box">
                    <h3>About</h3>
                    <a href="#"> <i></i>About us</a>
                    <a href="#"> <i></i>Mission</a>
                    <a href="#"> <i></i>Vision</a>
                </div>

                <div class="box">
                    <h3>Follow Us</h3>
                    <a href="#"> <i><FacebookRoundedIcon /></i> VisionBI </a>
                    <a href="#"> <i><TwitterIcon /></i> @visionBI </a>
                    <a href="#"> <i><InstagramIcon /></i> @visionBI </a>
                </div>
            </div>
            <div class="credit"> &copy; created by <span>visionBI</span> | all right reserved </div>
        </section>
    </div>
)
};