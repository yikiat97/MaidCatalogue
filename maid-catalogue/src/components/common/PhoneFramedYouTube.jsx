import React from 'react';

const PhoneFramedYouTube = ({
  videoId,
  title = "YouTube video",
  className = "",
  autoplay = false,
  muted = true,
  ariaLabel
}) => {
  // Convert YouTube URL to embed URL
  const getEmbedUrl = (id) => {
    let embedId = id;

    // Handle different YouTube URL formats
    if (id.includes('youtube.com/shorts/')) {
      embedId = id.split('youtube.com/shorts/')[1].split('?')[0];
    } else if (id.includes('youtube.com/watch?v=')) {
      embedId = id.split('v=')[1].split('&')[0];
    } else if (id.includes('youtu.be/')) {
      embedId = id.split('youtu.be/')[1].split('?')[0];
    }

    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      showinfo: '0',
      controls: '1',
      ...(autoplay && { autoplay: '1' }),
      ...(muted && { mute: '1' })
    });

    return `https://www.youtube.com/embed/${embedId}?${params.toString()}`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame Container */}
      <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
        {/* Phone Shadow/Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[2.5rem] shadow-2xl transform rotate-1"></div>

        {/* Main Phone Body */}
        <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] p-2 shadow-xl">
          {/* Phone Screen */}
          <div className="relative bg-black rounded-[2rem] overflow-hidden">
            {/* Screen Content */}
            <div className="relative aspect-[9/19.5] bg-black">
              {/* YouTube Embed */}
              <iframe
                src={getEmbedUrl(videoId)}
                title={title}
                aria-label={ariaLabel || title}
                className="absolute inset-0 w-full h-full rounded-[1.8rem]"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Phone UI Elements */}
            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
          </div>

          {/* Phone Hardware Elements */}
          {/* Volume Buttons */}
          <div className="absolute left-0 top-[25%] w-1 h-12 bg-gray-700 rounded-l-sm"></div>
          <div className="absolute left-0 top-[35%] w-1 h-8 bg-gray-700 rounded-l-sm"></div>

          {/* Power Button */}
          <div className="absolute right-0 top-[30%] w-1 h-12 bg-gray-700 rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneFramedYouTube;