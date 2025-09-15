import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../ui/hover-card';
import { Separator } from '../../ui/separator';
import { cn } from '../../../lib/utils';
import { 
  Box, 
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/Info';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import HeightIcon from '@mui/icons-material/Height';
import FitnessIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import maidPic from '../../../assets/maidPic.jpg';
import API_CONFIG from '../../../config/api.js';
import { getCountryFlag } from '../../../utils/flagUtils';
import MaidDetailsPopup from '../MaidDetailsPopup';


// Skill icons mapping
const skillIcons = {
  Cooking: '👩‍🍳',
  Housekeeping: '🧹',
  Childcare: '👶',
  Babysitting: '🍼',
  'Elderly Care': '🧓',
  'Dog(s)': '🐕',
  'Cat(s)': '🐱',
  Caregiving: '💝',
};

/**
 * Variation 6: Interactive Hover Detail Card
 * Features: Compact card with rich hover overlay for detailed information disclosure
 * Technology: shadcn/ui HoverCard with progressive detail revelation
 * Accessibility: Focus-triggered hover for keyboard users, touch-friendly mobile implementation
 */
export default function MaidCardVariation6({ 
  maid, 
  isAuthenticated, 
  isSelected = false, 
  onSelectionChange,
  className,
  ...props 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const maidAge = calculateAge(maid.DOB);

  // Image optimization function
  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return maidPic;
    if (originalUrl.startsWith('http')) return originalUrl;
    return API_CONFIG.buildImageUrl(originalUrl);
  };

  // Event handlers
  const toggleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(maid.id, !isSelected);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;
    
    const previousFavoritedState = isFavorited;
    
    try {
      // Optimistically update UI
      setIsFavorited(!isFavorited);
      
      const method = previousFavoritedState ? 'DELETE' : 'POST';
      let apiUrl;
      let requestOptions;

      if (previousFavoritedState) {
        // DELETE: Use catalogue endpoint with maid ID in URL path (no request body)
        apiUrl = API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES}/${maid.id}`);
        requestOptions = {
          method: 'DELETE',
          credentials: 'include'
        };
      } else {
        // POST: Use user endpoint with maid ID in request body
        apiUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES);
        requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ maidId: maid.id })
        };
      }

      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to update favorites: ${response.status}`);
      }

      // API call successful
      const action = previousFavoritedState ? 'removed from' : 'added to';
      console.log(`Maid ${maid.name} ${action} favorites`);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert the optimistic update on error
      setIsFavorited(previousFavoritedState);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi, I'm interested in maid ${maid.name} (ID: ${maid.id}).`;
    window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
  };

  const displayLabel = maid.type?.includes("Transfer")
    ? "Transfer"
    : maid.type?.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";

  // Reset image loading state when maid changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [maid.id]);

  // Hover Card Content Component
  const HoverDetailContent = () => (
    <div className="w-80 space-y-4">
      {/* Header with larger avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-orange-200">
          <AvatarImage
            src={getOptimizedImageUrl(maid.imageUrl)}
            alt={`Profile of ${maid.name}`}
            className={cn(
              "object-cover",
              isAuthenticated ? "opacity-100" : "blur-sm opacity-80"
            )}
          />
          <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
            {maid.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MA'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-slate-900">{maid.name}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <img 
              src={getCountryFlag(maid.country)} 
              alt={`${maid.country} flag`}
              className="w-4 h-3"
            />
            <span>{maid.country}</span>
            {maidAge && (
              <>
                <span>•</span>
                <span>{maidAge}yo</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      {/* Physical Stats */}
      {(maid.height || maid.weight) && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <PersonIcon style={{ fontSize: '14px', color: '#6b7280' }} />
            <span className="text-sm font-medium text-slate-700">Physical</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {maid.height && (
              <div className="flex items-center gap-1 text-slate-600">
                <HeightIcon style={{ fontSize: '12px' }} />
                <span>{maid.height}cm</span>
              </div>
            )}
            {maid.weight && (
              <div className="flex items-center gap-1 text-slate-600">
                <FitnessIcon style={{ fontSize: '12px' }} />
                <span>{maid.weight}kg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills */}
      {maid.skills && maid.skills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <WorkIcon style={{ fontSize: '14px', color: '#6b7280' }} />
            <span className="text-sm font-medium text-slate-700">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {maid.skills.map((skill, idx) => {
              const skillEmoji = skillIcons[skill];
              return (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-slate-100 text-slate-700"
                >
                  {skillEmoji && (
                    <span role="img" aria-label={skill} className="mr-1">
                      {skillEmoji}
                    </span>
                  )}
                  {skill}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Languages */}
      {maid.languages && maid.languages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LanguageIcon style={{ fontSize: '14px', color: '#6b7280' }} />
            <span className="text-sm font-medium text-slate-700">Languages</span>
          </div>
          <p className="text-sm text-slate-600">
            {maid.languages.join(' • ')}
          </p>
        </div>
      )}

      <Separator className="my-3" />

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleSelection();
          }}
          size="sm"
          variant={isSelected ? "default" : "outline"}
          className={cn(
            "flex-1 text-xs",
            isSelected 
              ? "bg-orange-500 hover:bg-orange-600 text-white" 
              : "border-orange-200 text-orange-700 hover:bg-orange-50"
          )}
        >
          {isSelected ? 'Selected ✓' : 'Select'}
        </Button>
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleWhatsAppContact();
          }}
          size="sm"
          variant="outline"
          className="px-3 border-green-200 text-green-700 hover:bg-green-50"
        >
          <WhatsAppIcon style={{ fontSize: '14px' }} />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <HoverCard 
        openDelay={300} 
        closeDelay={100}
        onOpenChange={setIsHovered}
      >
        <HoverCardTrigger asChild>
          <Card 
            data-maid-id={maid.id}
            role="article"
            aria-label={`Hover for details: ${maid.name} from ${maid.country}`}
            className={cn(
              "w-full cursor-pointer transition-all duration-200",
              "hover:shadow-md hover:scale-[1.02] border-slate-200",
              "focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2",
              isHovered && "shadow-md scale-[1.02]",
              isMobile ? "h-36" : "h-40",
              className
            )}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
            onClick={() => isMobile && setShowDetailsPopup(true)}
            onTouchStart={() => isMobile && setIsHovered(true)}
            {...props}
          >
            <CardContent className="p-4 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Compact Avatar */}
                  <Avatar className={cn("ring-1 ring-slate-200", isMobile ? "h-10 w-10" : "h-12 w-12")}>
                    {!imageLoaded && !imageError && (
                      <div className="w-full h-full bg-slate-200 animate-pulse rounded-full" />
                    )}
                    
                    {!imageError && (
                      <AvatarImage
                        src={getOptimizedImageUrl(maid.imageUrl)}
                        alt={`${maid.name}'s avatar`}
                        className={cn(
                          "object-cover",
                          isAuthenticated ? "opacity-100" : "blur-sm opacity-80"
                        )}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                          setImageError(true);
                          setImageLoaded(true);
                        }}
                      />
                    )}
                    
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-sm">
                      {maid.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MA'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Lock Icon for Unauthenticated Users */}
                  {!isAuthenticated && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-slate-900/80 rounded-full p-1">
                        <Typography variant="caption" className="text-white text-xs">
                          🔒
                        </Typography>
                      </div>
                    </div>
                  )}

                  {/* Name and Location */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-sm">
                      {maid.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <img 
                        src={getCountryFlag(maid.country)} 
                        alt={`${maid.country} flag`}
                        className="w-3 h-2"
                      />
                      <span>{maid.country}</span>
                    </div>
                  </div>
                </div>

                {/* Favorite + Info Buttons */}
                <div className="flex items-center gap-1">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite();
                    }}
                    size="small"
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    style={{
                      color: isFavorited ? '#e91e63' : '#9ca3af',
                      padding: '4px'
                    }}
                  >
                    {isFavorited ? 
                      <FavoriteIcon style={{ fontSize: '16px' }} /> : 
                      <FavoriteBorderIcon style={{ fontSize: '16px' }} />
                    }
                  </IconButton>

                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <InfoIcon style={{ fontSize: '12px', color: '#6b7280' }} />
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-3 mb-3 text-xs">
                <Badge variant="outline" className="px-2 py-1 border-slate-200 text-slate-600">
                  {displayLabel}
                </Badge>
                {maidAge && (
                  <span className="text-slate-600">{maidAge} years</span>
                )}
              </div>

              {/* Salary and Skills Preview */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  {maid.salary && (
                    <Badge 
                      variant="default" 
                      className="bg-green-100 text-green-700 hover:bg-green-200 font-semibold"
                    >
                      ${maid.salary}/mo
                    </Badge>
                  )}
                  
                  {maid.skills && maid.skills.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {maid.skills.length} skill{maid.skills.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </HoverCardTrigger>

        {/* Hover Card Content - Desktop Only */}
        {!isMobile && (
          <HoverCardContent 
            side="right" 
            sideOffset={10}
            className="bg-white shadow-xl border-slate-200"
          >
            <HoverDetailContent />
          </HoverCardContent>
        )}
      </HoverCard>
      
      {/* Mobile Details Popup */}
      <MaidDetailsPopup
        open={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        maid={maid}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}