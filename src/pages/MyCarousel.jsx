import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MyCarousel.css';
import space2 from "../assets/images/space2.png"
import space1 from "../assets/images/space1.jpg"
import ad from "../assets/images/ad.jpg"
import clg from "../assets/images/clg.jpg"
import space3 from "../assets/images/space3.jpg"
import q1 from "../assets/images/q1.jpeg"
import q2 from "../assets/images/q2.jpeg"
import q3 from "../assets/images/q3.jpeg"
import q4 from "../assets/images/q4.jpeg"
import { Badge } from 'antd';

const MyCarousel = () => {
    const [show, setShow] = useState(true);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (current, next) => {

        },
        afterChange: current => {

        }
    };

    return (
        <div className="slide-container">
            <div className='notificationCount'><Badge className='makeittop' count={show ? 25 : 0} /></div>
            <Slider {...settings}>
                <div className="wrapper">
                    <div className="caro-card card-body-">
                        <div className="caro-card__image caro-card__image--barbarian">
                            <img src={q1} alt="space1" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className='date-'>
                                <div style={{ fontSize: "30px", color: "#0D92F4", fontWeight: "bold", fontFamily: "sans-serif" }}>15</div>
                                <div style={{ fontWeight: "bold", color: "white" }}>Nov</div>
                            </div>
                            <div style={{ marginLeft: "40px" }} className='message-'>
                            <div style={{ color: "#fff", fontSize: "20px", letterSpacing: "0.4px" }}>take-a-thon</div>
                            <div style={{ fontSize: "14px", color: "#ffee00" }}>Next gen design socity</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="wrapper">
                    <div className="caro-card card-body-">
                        <div className="caro-card__image caro-card__image--barbarian">
                            <img src={q2} alt="space1" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className='date-'>
                                <div style={{ fontSize: "30px", color: "#0D92F4", fontWeight: "bold", fontFamily: "sans-serif" }}>22</div>
                                <div style={{ fontWeight: "bold", color: "white" }}>DEC</div>
                            </div>
                            <div style={{ marginLeft: "40px" }} className='message-'>
                            <div style={{ color: "#fff", fontSize: "20px", letterSpacing: "0.4px" }}>take-a-thon</div>
                            <div style={{ fontSize: "14px", color: "#ffee00" }}>Next gen design socity</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="wrapper">
                    <div className="caro-card card-body-">
                        <div className="caro-card__image caro-card__image--barbarian">
                            <img src={q3} alt="space1" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className='date-'>
                                <div style={{ fontSize: "30px", color: "#0D92F4", fontWeight: "bold", fontFamily: "sans-serif" }}>30</div>
                                <div style={{ fontWeight: "bold", color: "white" }}>DEC</div>
                            </div>
                            <div style={{ marginLeft: "40px" }} className='message-'>
                            <div style={{ color: "#fff", fontSize: "20px", letterSpacing: "0.4px" }}>take-a-thon</div>
                            <div style={{ fontSize: "14px", color: "#ffee00" }}>Next gen design socity</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="wrapper">
                    <div className="caro-card card-body-">
                        <div className="caro-card__image caro-card__image--barbarian">
                            <img src={q4} alt="space1" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className='date-'>
                                <div style={{ fontSize: "30px", color: "#0D92F4", fontWeight: "bold", fontFamily: "sans-serif" }}>15</div>
                                <div style={{ fontWeight: "bold", color: "white" }}>OCT</div>
                            </div>
                            <div style={{ marginLeft: "40px" }} className='message-'>
                            <div style={{ color: "#fff", fontSize: "20px", letterSpacing: "0.4px" }}>take-a-thon</div>
                            <div style={{ fontSize: "14px", color: "#ffee00" }}>Next gen design socity</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="wrapper">
                    <div className="caro-card card-body-">
                        <div className="caro-card__image caro-card__image--barbarian">
                            <img src={clg} alt="space1" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", marginTop: "-6px" }}>
                            <div className='date-'>
                                <div style={{ fontSize: "30px", color: "#0D92F4", fontWeight: "bold", fontFamily: "sans-serif" }}>15</div>
                                <div style={{ fontWeight: "bold", color: "white" }}>OCT</div>
                            </div>
                            <div style={{ marginLeft: "40px" }} className='message-'>
                                <div style={{ color: "#fff", fontSize: "20px", letterSpacing: "0.4px" }}>take-a-thon</div>
                                <div style={{ fontSize: "14px", color: "#ffee00" }}>Next gen design socity</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="wrapper">
                    <div className="caro-card card-body-">
                        <div className="caro-card__image caro-card__image--barbarian">
                            <img src={space1} alt="space1" />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div className='date-'>
                                <div style={{ fontSize: "30px", color: "#0D92F4", fontWeight: "bold", fontFamily: "sans-serif" }}>15</div>
                                <div style={{ fontWeight: "bold", color: "white" }}>OCT</div>
                            </div>
                            <div style={{ marginLeft: "40px" }} className='message-'>
                            <div style={{ color: "#fff", fontSize: "20px", letterSpacing: "0.4px" }}>take-a-thon</div>
                            <div style={{ fontSize: "14px", color: "#ffee00" }}>Next gen design socity</div>
                            </div>
                        </div>

                    </div>
                </div>





            </Slider>
        </div>
    );
};

export default MyCarousel;
