import bannerVBI from "../images/bannerVBI.png";
import comparativas from "../images/comparativas.png";
import graficos from "../images/graficos.png";
import predicciones from "../images/predicciones.png";
import csv from "../images/csv.png";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";


function PresentationPage() {
    return (
        <section>
            <div className="index">
                <div className="index-banner">
                    <div className="presentation">
                        <h3>Transforming data into strategy</h3>
                        <p>Business Intelligence is the key to our success. We are
                            dedicated to leveraging business intelligence to make
                            informed and strategic decisions that enable us to
                            innovate and create exceptional solutions.</p>
                        <div className='index-btn'>    
                                <Link to='/registro' >JOIN US</Link>    
                        </div>
                    </div>
                    <div className="presentation-photo">
                        <img src={bannerVBI} alt="bannerVBI" className='banner-img' />
                    </div>
                </div>

            </div>
            <div className="services">
                <h3>SERVICES</h3>
                <div className="index-info" >
                    <div className="box-services">
                        <img src={comparativas} alt="comparativas" className='services-img' />
                        <h2>COMPARE</h2>
                        <p>We assess your sales goals and compare them against your actual sales figures. Gain a clear understanding of how you're performing in relation to your targets and make data-driven decisions.</p>
                    </div>
                    <div className="box-services">
                        <img src={predicciones} alt="predicciones" className='services-img' />
                        <h2>PREDICT</h2>
                        <p>Based on your sales history, we generate accurate forecasts for your sales over the next six months. Use this information to plan your operations, adjust your inventory, and take proactive steps to optimize your outcomes.</p>
                    </div>
                    <div className="box-services">
                        <img src={graficos} alt="graficos" className='services-img' />
                        <h2>GRAPH</h2>
                        <p>Visualize the movement of your sales intuitively through interactive graphs. Observe trends, seasonal patterns, and changes in your sales data to make informed and strategic decisions.</p>
                    </div>
                </div>
            </div>
            <div className="file">
                <h3>Upload your history data</h3>
                <div className="index-file" >
                    <div className="box-file">
                        <img src={csv} alt="csv" className='file-img' />
                    </div>
                    <div className="box-file">
                        <p>To upload your sales history, you can use a CSV file (Comma-Separated Values) that includes the following information:</p>
                        <ul> • Purchase Order Number: This field records the unique number associated with each purchase transaction.</ul>
                        <ul> • Date: Indicates the date on which the sale occurred.</ul>

                        <ul> • Category: Describes the category or type of product sold in that transaction.</ul>

                        <ul> • Quantity: Reflects the quantity of products sold in that purchase order.</ul>

                        <ul> • Price: Represents the unit price of each product sold.</ul>

                        <ul> • State: Refers to the geographical region or location where the sale took place.</ul>

                        <ul> • Neighborhood: Specifies the smaller geographic area where the transaction occurred.</ul>
                        <p>To complete this process, simply upload a CSV file containing this information. This will enable you to analyze and manage your sales history efficiently and effectively.</p>
                    </div>
                </div>
            </div>

        </section>

    );
}

export default PresentationPage;