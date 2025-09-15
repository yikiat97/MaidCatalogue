import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import { 
  Box, 
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Tooltip
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
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
 * Variation 5: Professional Profile Card
 * Features: LinkedIn-style professional presentation with large avatar and credential focus
 * Technology: shadcn/ui components with professional business aesthetic
 * Accessibility: WCAG 2.1 AA compliant with semantic structure and keyboard navigation
 */
export default function MaidCardVariation5({ 
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Calculate professional score (simulated)
  const calculateProfessionalScore = () => {
    const skillCount = maid.skills?.length || 0;
    const languageCount = maid.languages?.length || 0;
    const baseScore = 70;
    const skillBonus = Math.min(20, skillCount * 4);
    const languageBonus = Math.min(10, languageCount * 2);
    return Math.min(100, baseScore + skillBonus + languageBonus);
  };

  const professionalScore = calculateProfessionalScore();

  return (
    <>
      <Card 
        data-maid-id={maid.id}
        role="article"
        aria-label={`Professional profile for ${maid.name} from ${maid.country}`}
        className={cn(
          "w-full transition-all duration-200 hover:shadow-lg border-slate-200",
          "focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2",
          isMobile ? "h-80" : "h-96",
          className
        )}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        }}
        {...props}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            {/* Professional Avatar Section */}
            <div className="relative flex-shrink-0">
              {/* Avatar with professional styling */}
              <Avatar className={cn(
                "ring-2 ring-slate-200 ring-offset-2",
                isMobile ? "h-16 w-16" : "h-20 w-20"
              )}>
                {!imageLoaded && !imageError && (
                  <Skeleton 
                    variant="circular" 
                    width="100%" 
                    height="100%"
                    className="bg-slate-200"
                  />
                )}
                
                {!imageError && (
                  <AvatarImage
                    src={getOptimizedImageUrl(maid.imageUrl)}
                    alt={`Professional photo of ${maid.name}`}
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      isAuthenticated ? "opacity-100" : "blur-sm opacity-80"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      setImageLoaded(true);
                    }}
                  />
                )}
                
                <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
                  {maid.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MA'}
                </AvatarFallback>
              </Avatar>

              {/* Verification Badge */}
              <div className="absolute -top-1 -right-1">
                <Badge 
                  variant="default" 
                  className="h-6 w-6 p-0 rounded-full bg-green-500 hover:bg-green-600 border-white border-2"
                  title="Verified Profile"
                >
                  <VerifiedIcon className="h-3 w-3 text-white" />
                </Badge>
              </div>

              {/* Professional Score Badge */}
              <div className="absolute -bottom-1 -right-1">
                <Badge 
                  variant="outline" 
                  className="px-2 py-1 bg-white border-orange-200 text-orange-700 font-bold text-xs"
                  title={`Professional Score: ${professionalScore}%`}
                >
                  {professionalScore}%
                </Badge>
              </div>

              {/* Lock Icon for Unauthenticated Users */}
              {!isAuthenticated && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-full">
                  <Typography variant="h6" className="text-white">
                    🔒
                  </Typography>
                </div>
              )}
            </div>

            {/* Professional Information */}
            <div className="flex-1 min-w-0">
              {/* Name and Title */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-900 truncate">
                    {maid.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    Professional Domestic Helper
                  </p>
                </div>
                
                {/* Favorite Button */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite();
                  }}
                  size="small"
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  className="ml-2"
                  style={{
                    color: isFavorited ? '#e91e63' : '#9ca3af',
                  }}
                >
                  {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
              </div>

              {/* Location and Experience */}
              <div className="flex items-center gap-3 mb-3 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <img 
                    src={getCountryFlag(maid.country)} 
                    alt={`${maid.country} flag`}
                    className="w-4 h-3"
                  />
                  <span>{maid.country}</span>
                </div>
                {maidAge && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1">
                      <PersonIcon style={{ fontSize: '14px' }} />
                      <span>{maidAge} years old</span>
                    </div>
                  </>
                )}
                <span className="text-slate-300">•</span>
                <Badge variant="secondary" className="text-xs">
                  {displayLabel}
                </Badge>
              </div>

              {/* Salary - Professional Display */}
              {maid.salary && (
                <div className="flex items-center gap-2 mb-3">
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1 border-green-200 text-green-700 bg-green-50 font-bold"
                  >
                    ${maid.salary}/month
                  </Badge>
                  <span className="text-xs text-slate-500">Salary expectation</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          {/* Professional Skills */}
          {maid.skills && maid.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <WorkIcon style={{ fontSize: '14px', color: '#6b7280' }} />
                <h4 className="text-sm font-semibold text-slate-700">Core Skills</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {maid.skills.slice(0, isExpanded ? maid.skills.length : 4).map((skill, idx) => {
                  const skillEmoji = skillIcons[skill];
                  return (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs px-2 py-1 border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100"
                    >
                      {skillEmoji && (
                        <span role="img" aria-label={skill} className="mr-1 text-xs">
                          {skillEmoji}
                        </span>
                      )}
                      {skill}
                    </Badge>
                  );
                })}
                {maid.skills.length > 4 && !isExpanded && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                    className="h-6 px-2 text-xs text-orange-600 hover:text-orange-700"
                  >
                    +{maid.skills.length - 4} more
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {maid.languages && maid.languages.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <LanguageIcon style={{ fontSize: '14px', color: '#6b7280' }} />
                <h4 className="text-sm font-semibold text-slate-700">Languages</h4>
              </div>
              <p className="text-sm text-slate-600">
                {maid.languages.join(' • ')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection();
                }}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-1 font-medium",
                  isSelected 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "border-orange-200 text-orange-700 hover:bg-orange-50"
                )}
                aria-label={isSelected ? 'Deselect maid' : 'Select maid'}
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
                aria-label={`Contact ${maid.name} via WhatsApp`}
              >
                <WhatsAppIcon style={{ fontSize: '16px' }} />
              </Button>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailsPopup(true);
                }}
                size="sm"
                variant="outline"
                className="px-3 border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label={`View detailed profile of ${maid.name}`}
              >
                View Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Maid Details Popup */}
      <MaidDetailsPopup
        open={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        maid={maid}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}