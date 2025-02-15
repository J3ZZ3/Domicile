import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../ClientStyles/HeroCarousel.css';

const HeroCarousel = ({ slides, height = '70vh', autoPlay = true }) => {
  return (
    <div className="hero-carousel" style={{ height }}>
      <Carousel
        autoPlay={autoPlay}
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        interval={5000}
        transitionTime={500}
        showArrows={false}
        swipeable={true}
        emulateTouch={true}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide" style={{ height }}>
            <img src={slide.url} alt={slide.title} />
            <div className="carousel-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              {slide.actionButton && (
                <button 
                  className="carousel-cta"
                  onClick={slide.actionButton.onClick}
                >
                  {slide.actionButton.text}
                </button>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;