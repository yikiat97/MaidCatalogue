import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const YouTubeVideoControls = ({ playerId }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true); // YouTube starts with autoplay
  const [isMuted, setIsMuted] = useState(true); // YouTube starts muted
  const [isReady, setIsReady] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('auto');

  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      // YouTube API ready callback
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      // Cleanup
      if (player) {
        player.destroy();
      }
    };
  }, [playerId]);

  // Quality enforcement function
  const enforceMinimumQuality = useCallback((playerInstance) => {
    if (!playerInstance) return;
    
    try {
      const availableQualities = playerInstance.getAvailableQualityLevels();
      const currentQuality = playerInstance.getPlaybackQuality();
      
      // Force minimum 720p quality
      if (availableQualities.includes('hd720') && currentQuality !== 'hd720' && currentQuality !== 'hd1080') {
        playerInstance.setPlaybackQuality('hd720');
        setCurrentQuality('hd720');
      } else if (availableQualities.includes('hd1080') && currentQuality !== 'hd1080') {
        playerInstance.setPlaybackQuality('hd1080');
        setCurrentQuality('hd1080');
      }
    } catch (error) {
      console.log('Quality enforcement error:', error);
    }
  }, []);

  const initializePlayer = useCallback(() => {
    if (window.YT && window.YT.Player) {
      const ytPlayer = new window.YT.Player(playerId, {
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setIsReady(true);
            
            // Force minimum 720p quality on ready
            setTimeout(() => {
              enforceMinimumQuality(event.target);
            }, 1000);
            
            // Set initial state
            setIsPlaying(event.target.getPlayerState() === window.YT.PlayerState.PLAYING);
            setIsMuted(event.target.isMuted());
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          }
        }
      });
    }
  }, [playerId, enforceMinimumQuality]);

  const togglePlayPause = useCallback(() => {
    if (!player || !isReady) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying, isReady]);

  const toggleMute = useCallback(() => {
    if (!player || !isReady) return;

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }, [player, isMuted, isReady]);

  // Periodic quality monitoring to prevent downgrades
  useEffect(() => {
    if (!player || !isReady) return;
    
    const qualityCheckInterval = setInterval(() => {
      enforceMinimumQuality(player);
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(qualityCheckInterval);
  }, [player, isReady, enforceMinimumQuality]);

  return (
    <div className="absolute bottom-4 left-4 flex gap-3 z-20">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="flex items-center justify-center w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/50 transition-all duration-200 hover:scale-105 min-w-[44px] min-h-[44px]"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        disabled={!isReady}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="flex items-center justify-center w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/50 transition-all duration-200 hover:scale-105 min-w-[44px] min-h-[44px]"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        disabled={!isReady}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};

export default YouTubeVideoControls;