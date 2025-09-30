import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';


const sponsorList = [
    {
        imgUrl: 'assets/images/sponsor/01.png',
        imgAlt: 'sponsor rajibraj91 rajibraj',
    },
    {
        imgUrl: 'assets/images/sponsor/02.png',
        imgAlt: 'sponsor rajibraj91 rajibraj',
    },
    {
        imgUrl: 'assets/images/sponsor/03.png',
        imgAlt: 'sponsor rajibraj91 rajibraj',
    },
    {
        imgUrl: 'assets/images/sponsor/04.png',
        imgAlt: 'sponsor rajibraj91 rajibraj',
    },
    {
        imgUrl: 'assets/images/sponsor/05.png',
        imgAlt: 'sponsor rajibraj91 rajibraj',
    },
    {
        imgUrl: 'assets/images/sponsor/06.png',
        imgAlt: 'sponsor rajibraj91 rajibraj',
    },
]


const Sponsor = () => {
    return (
        <div className="sponsor-section section-bg">
            <div className="container">
                <div className="section-wrapper">
                    <div className="sponsor-slider">
                        <Swiper
                            slidesPerView={2}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            breakpoints={{
                                0: {
                                    slidesPerView: 2,
                                    spaceBetween: 8,
                                },
                                480: {
                                    slidesPerView: 3,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 14,
                                },
                                992: {
                                    slidesPerView: 5,
                                    spaceBetween: 18,
                                },
                                1200: {
                                    slidesPerView: 6,
                                    spaceBetween: 22,
                                },
                            }}
                        >
                            {sponsorList.map((val, i) => (
                                <SwiperSlide key={i}>
                                    <div
                                        className="sponsor-iten"
                                        style={{ padding: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <div className="sponsor-thumb" style={{ width: '100%', textAlign: 'center' }}>
                                            <img
                                                src={`${val.imgUrl}`}
                                                alt={`${val.imgAlt}`}
                                                style={{ maxWidth: 110, width: '100%', height: 'auto', objectFit: 'contain', display: 'inline-block' }}
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Sponsor;