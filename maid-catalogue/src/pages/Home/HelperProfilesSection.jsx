import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Badge } from '../../components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../../components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { MapPin, Calendar, Briefcase, Star, Heart } from 'lucide-react';
import { useAnimation } from '../../hooks/useAnimation';

const HelperProfilesSection = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  
  // Hardcoded helper data
  const helpers = [
    {
      id: 1,
      name: 'Maria Santos',
      country: 'Philippines',
      salary: 680,
      skills: ['Cooking', 'Child Care', 'Elderly Care'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.8,
      experience: '8 years',
      availability: 'Available',
      age: 32,
      languages: ['English', 'Filipino', 'Mandarin']
    },
    {
      id: 2,
      name: 'Siti Rahman',
      country: 'Indonesia',
      salary: 650,
      skills: ['Housekeeping', 'Cooking', 'Pet Care'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.9,
      experience: '6 years',
      availability: 'Available',
      age: 28,
      languages: ['English', 'Indonesian', 'Malay']
    },
    {
      id: 3,
      name: 'Chen Wei Lin',
      country: 'Taiwan',
      salary: 720,
      skills: ['Child Care', 'Tutoring', 'Housekeeping'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.7,
      experience: '10 years',
      availability: 'Available',
      age: 35,
      languages: ['Mandarin', 'English', 'Taiwanese']
    },
    {
      id: 4,
      name: 'Priya Sharma',
      country: 'India',
      salary: 600,
      skills: ['Cooking', 'Housekeeping', 'Elderly Care'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.6,
      experience: '5 years',
      availability: 'Available',
      age: 30,
      languages: ['English', 'Hindi', 'Tamil']
    },
    {
      id: 5,
      name: 'Fatima Al-Zahra',
      country: 'Myanmar',
      salary: 620,
      skills: ['Child Care', 'Cooking', 'Light Housework'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.5,
      experience: '4 years',
      availability: 'Available',
      age: 26,
      languages: ['English', 'Burmese', 'Thai']
    },
    {
      id: 6,
      name: 'Lily Nguyen',
      country: 'Vietnam',
      salary: 640,
      skills: ['Housekeeping', 'Cooking', 'Ironing'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.8,
      experience: '7 years',
      availability: 'Available',
      age: 29,
      languages: ['English', 'Vietnamese', 'Cantonese']
    }
  ];

  const toggleFavorite = (helperId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(helperId)) {
        newFavorites.delete(helperId);
      } else {
        newFavorites.add(helperId);
      }
      return newFavorites;
    });
  };

  const handleHelperClick = (helperId) => {
    navigate(`/maid/${helperId}`);
  };

  const handleViewAll = () => {
    navigate('/catalogue');
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isTitleVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize text-gray-900 mb-4">
            <span className="text-black">Find Your Perfect </span>
            <span className="text-[#ff690d]">Helper</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover talented helpers, ready to become part of your family
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 my-4">
              {helpers.map((helper) => (
                <CarouselItem key={helper.id} className="pl-4 py-2 md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden"
                    padding="none"
                  >
                      {/* Helper Image */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={helper.imageUrl}
                          alt={helper.name}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = "/images/img_frame_4_309x253.png";
                          }}
                        />
                        
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(helper.id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110"
                        >
                          <Heart 
                            className={`w-4 h-4 transition-colors duration-200 ${
                              favorites.has(helper.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                        </button>
                        
                        {/* Availability Badge */}
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-green-500 text-white border-0">
                            {helper.availability}
                          </Badge>
                        </div>
                        
                        {/* Rating */}
                        <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{helper.rating}</span>
                        </div>
                      </div>
                      
                      {/* Helper Details */}
                      <div className="p-6 space-y-4" onClick={() => handleHelperClick(helper.id)}>
                        {/* Name and Age */}
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                            {helper.name}
                          </h3>
                          <p className="text-gray-600 text-sm">{helper.age} years old</p>
                        </div>
                        
                        {/* Location and Experience */}
                        <div className="flex items-center space-x-4 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{helper.country}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-sm">{helper.experience} experience</span>
                          </div>
                        </div>
                        
                        {/* Salary */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Monthly Salary</span>
                          </div>
                          <span className="text-lg font-bold text-orange-600">${helper.salary}</span>
                        </div>
                        
                        {/* Skills */}
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 font-medium">Specialties:</p>
                          <div className="flex flex-wrap gap-2">
                            {helper.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                      </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="-left-12 lg:-left-16 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl" />
            <CarouselNext className="-right-12 lg:-right-16 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl" />
          </Carousel>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-4">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            View All Helpers
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelperProfilesSection;