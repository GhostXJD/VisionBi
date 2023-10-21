import mision from "../images/Mision.png";

function AboutUs() {
    return (
        <section>
            <div className="about">
                <div className="about-banner">
                    <div className="presentation">
                        <h3>MISSION</h3>
                        <p>To facilitate business success through innovative and precise solutions.
                     Our mission is to provide companies with the necessary tools to make
                      informed and strategic decisions, enhancing their performance and
                       growth through data analytics and accurate forecasting.</p>
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