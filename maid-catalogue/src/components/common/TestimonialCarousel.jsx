import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Card from '../ui/Card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    id: 1,
    name: "Zhi Ren Yeo",
    role: "Verified Google Review",
    image: "/images/img_frame_4.png",
    rating: 5,
    text: "I had a great experience with Easy Hire Maid Agency. From the start, their staff were friendly, professional, and very responsive to all my questions. They took the time to understand my family's specific needs and recommended suitable helpers with relevant experience and good attitudes. The process was smooth and efficient — from the initial consultation to the paperwork and deployment. What really stood out was their transparency and how they kept me informed at every step. Even after placement, they followed up to make sure everything was going well, which shows they truly care about their clients and the helpers. Highly recommend Easy Hire if you're looking for a reliable and supportive maid agency. Great service, great team!"
  },
  {
    id: 2,
    name: "Mak Lim",
    role: "Verified Google Review",
    image: "/images/img_frame_4.png",
    rating: 5,
    text: "Absolutely fantastic service from Easy Hire! From the start to finish, the process was seamless. The initial consultation was thorough and helpful. The consultant Ms. Li Ling was very professional and helpful throughout the process. I highly recommend their service for the efficiency and trustworthiness of the matched helper."
  },
  {
    id: 3,
    name: "Michelle Tan",
    role: "Healthcare Professional",
    image: "/images/img_frame_4.png",
    rating: 5,
    text: "Li Ling's personal touch makes all the difference. You can tell she genuinely cares about both families and helpers. Our helper has become part of our family thanks to Easy Hire."
  },
  {
    id: 4,
    name: "Robert Wong",
    role: "Business Owner",
    image: "/images/img_frame_4.png",
    rating: 5,
    text: "The transparent pricing and no hidden charges policy is exactly what we needed. Easy Hire delivers on their promises and provides excellent ongoing support."
  },
  {
    id: 5,
    name: "David Lim",
    role: "Senior Executive",
    image: "/images/img_frame_4.png",
    rating: 5,
    text: "After bad experiences with other agencies, Easy Hire was a breath of fresh air. The $0 service fee package is amazing, and the team was honest and supportive every step of the way."
  }
];

const TestimonialCard = ({ testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Character limit for approximately 4 lines of text
  const CHARACTER_LIMIT = 280;
  const isLongText = testimonial.text.length > CHARACTER_LIMIT;
  
  // Get truncated text for collapsed state
  const getTruncatedText = () => {
    if (!isLongText) return testimonial.text;
    
    // Find a good breaking point (avoid cutting words)
    let truncateAt = CHARACTER_LIMIT;
    while (truncateAt > CHARACTER_LIMIT - 20 && testimonial.text[truncateAt] !== ' ') {
      truncateAt--;
    }
    
    return testimonial.text.slice(0, truncateAt);
  };

  return (
    <Card variant="elevated" padding="large" className="min-h-[300px] bg-white relative overflow-hidden flex flex-col transition-all duration-300 ease-in-out">
      {/* Opening quotation mark */}
      <img 
        src="/images/quotation-right-mark-svgrepo-com.svg" 
        alt="quotation mark"
        className="absolute -top-[-10px] -right-[-10px] w-10 h-10 opacity-15"
        style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(93%) saturate(7471%) hue-rotate(14deg) brightness(101%) contrast(102%)' }}
      />
      
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }, (_, i) => (
          <Star 
            key={i} 
            className="w-4 h-4 fill-[#ff690d] text-[#ff690d]" 
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <div className="mb-6 flex-grow">
        <p className="text-gray-700 font-inter text-sm md:text-base leading-6 italic transition-all duration-300 ease-in-out">
          {isExpanded ? (
            <>
              {testimonial.text}{' '}
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#ff690d] hover:text-[#ff8a3d] font-inter font-medium text-sm transition-colors duration-200 focus:outline-none focus:underline cursor-pointer"
              >
                Read less
              </button>
            </>
          ) : (
            <>
              {getTruncatedText()}
              {isLongText && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-[#ff690d] hover:text-[#ff8a3d] font-inter font-medium text-sm transition-colors duration-200 focus:outline-none cursor-pointer ml-1"
                  title="Click to read full testimonial"
                >
                  ...
                </button>
              )}
            </>
          )}
        </p>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <img 
            src={testimonial.image} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff690d] to-[#ff8a3d] items-center justify-center text-white font-semibold text-lg hidden">
            {testimonial.name.split(' ').map(n => n.charAt(0)).join('')}
          </div>
        </div>
        <div>
          <h4 className="font-inter font-semibold text-gray-900 text-sm">
            {testimonial.name}
          </h4>
          <p className="font-inter text-gray-600 text-xs">
            {testimonial.role}
          </p>
        </div>
      </div>
    </Card>
  );
};

const TestimonialCarousel = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  // Autoplay plugin with improved configuration
  const autoplay = React.useRef(
    Autoplay({ 
      delay: 6000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true 
    })
  );

  // Handle pagination dots
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Ensure autoplay starts when component mounts
  useEffect(() => {
    if (api && autoplay.current) {
      // Start autoplay after a short delay to ensure everything is initialized
      const timer = setTimeout(() => {
        autoplay.current.play();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [api]);

  const goToSlide = (index) => {
    if (api) {
      api.scrollTo(index);
      // Resume autoplay after manual navigation
      setTimeout(() => {
        if (autoplay.current) {
          autoplay.current.reset();
          autoplay.current.play();
        }
      }, 100);
    }
  };

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
        plugins={[autoplay.current]}
        onMouseEnter={() => autoplay.current.stop()}
        onMouseLeave={() => {
          autoplay.current.reset();
          autoplay.current.play();
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <TestimonialCard testimonial={testimonial} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-4 bg-white shadow-lg hover:bg-gray-50 border-none h-10 w-10">
          <span className="sr-only">Previous testimonial</span>
        </CarouselPrevious>
        <CarouselNext className="right-0 translate-x-4 bg-white shadow-lg hover:bg-gray-50 border-none h-10 w-10">
          <span className="sr-only">Next testimonial</span>
        </CarouselNext>
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === current
                ? 'bg-[#ff690d] scale-110'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;