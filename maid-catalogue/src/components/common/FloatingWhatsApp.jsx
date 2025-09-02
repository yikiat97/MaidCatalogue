const FloatingWhatsApp = ({ 
  phoneNumber = "88270086", 
  message = "Hello! I'm interested in your maid services." 
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 right-6 sm:bottom-6 sm:right-5 md:bottom-8 md:right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="whatsapp-float-animated group transition-all duration-300 transform hover:scale-125"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <img 
          src="/images/whatsapp-animated.gif" 
          alt="WhatsApp" 
          className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat on WhatsApp
          <div className="absolute top-1/2 left-full w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-y-1/2"></div>
        </div>
      </button>
    </div>
  );
};

export default FloatingWhatsApp;