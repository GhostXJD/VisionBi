import vision from "../images/Vision.png";

function AboutUs() {
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>VISION</h3>
                        <p>To be recognized as leaders in the field of data analytics and
                            sales prediction. Our vision is to empower businesses worldwide,
                            helping them reach their full potential, optimize their operations,
                            and turn their data into competitive advantages. We aim to be the
                            trusted partner for companies aspiring to a more successful and
                            sustainable future.</p>
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