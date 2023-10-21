import contact from "../images/contactus.png";

function ContactUs() {
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>CONTACT US</h3>
                    </div>
                    <div className="presentation-photo">
                        <img src={contact} alt="contact" className='about-img' />
                    </div>
                </div>

            </div>
            <div className="about-info">
                <p>ola laalalalalaal</p>
            </div>
        </section>
    );
}

export default ContactUs;