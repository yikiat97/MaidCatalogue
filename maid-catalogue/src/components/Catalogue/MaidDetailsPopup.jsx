import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle,
  DialogClose 
} from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import  Button  from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { X, MessageCircle, User, Ruler, Weight, Users, Church, GraduationCap, Building, Lock, Star } from 'lucide-react';
import maidPic from '../../assets/maidPic.jpg';
import API_CONFIG from '../../config/api.js';

// Skill icons mapping with emojis
const SKILL_ICONS = {
  Cooking: '👨‍🍳',
  Housekeeping: '🧹', 
  Childcare: '👶',
  Babysitting: '🍼',
  'Elderly Care': '👴',
  'Dog(s)': '🐕',
  'Cat(s)': '🐱',
  Caregiving: '❤️',
};

// Utility component for emoji icons
const EmojiIcon = ({ children, className = "", size = "1em" }) => (
  <span 
    className={cn("inline-block select-none", className)}
    style={{ fontSize: size }}
  >
    {children}
  </span>
);

// Brand colors using Tailwind-compatible values (kept for potential future use)
// const BRAND_COLORS = {
//   primary: '#ff914d',
//   secondary: '#0c191b', 
//   success: '#27ae60',
//   warning: '#f39c12'
// };

export default function MaidDetailsPopup({ open, onClose, maid, isAuthenticated }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [detailedMaid, setDetailedMaid] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch detailed maid data when popup opens
  useEffect(() => {
    if (open && maid?.id) {
      setImageLoaded(false);
      setImageError(false);
      setLoading(true);
      
      const fetchDetailedMaid = async () => {
        try {
          let response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS}/${maid.id}`), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.status === 401) {
            // Try without credentials for unauthenticated users
            response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS}/${maid.id}`), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          }

          if (response.ok) {
            const data = await response.json();
            setDetailedMaid(data);
          } else {
            console.error('Failed to fetch detailed maid:', response.status);
            // Fallback to basic maid data
            setDetailedMaid(maid);
          }
        } catch (error) {
          console.error('Error fetching detailed maid:', error);
          // Fallback to basic maid data
          setDetailedMaid(maid);
        } finally {
          setLoading(false);
        }
      };

      fetchDetailedMaid();
    }
  }, [open, maid]);

  // Secure blur protection for unauthenticated users
  useEffect(() => {
    if (!open || !detailedMaid || isAuthenticated === true) return;

    const protectBlur = () => {
      const popupImages = document.querySelectorAll(`[data-popup-id="${detailedMaid.id}"] img:not([alt*="flag"])`);
      popupImages.forEach(img => {
        if (!img.style.filter || !img.style.filter.includes('blur')) {
          img.style.filter = 'blur(12px)';
          img.style.transform = 'scale(1.1)';
        }
        
        // Prevent context menu and drag
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.mozUserSelect = 'none';
        img.style.msUserSelect = 'none';
      });
    };

    protectBlur();
    const interval = setInterval(protectBlur, 500);

    return () => {
      clearInterval(interval);
    };
  }, [open, isAuthenticated, detailedMaid]);

  if (!maid) return null;
  
  // Use detailed maid data if available, otherwise fallback to basic maid data
  const displayMaid = detailedMaid || maid;
  
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-900">
              Loading detailed information...
            </h2>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Helper functions
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

  const getCountryFlag = (country) => {
    const countryCodeMap = {
      'Philippines': 'ph',
      'Indonesia': 'id',
      'Myanmar': 'mm',
      'India': 'in',
      'Bangladesh': 'bd',
      'Sri Lanka': 'lk',
      'Cambodia': 'kh',
      'Vietnam': 'vn',
      'Thailand': 'th',
      'Malaysia': 'my',
    };
    
    const countryCode = countryCodeMap[country] || 'un';
    return `https://flagcdn.com/${countryCode}.svg`;
  };

  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return maidPic;
    return originalUrl.startsWith('http') ? originalUrl : API_CONFIG.buildImageUrl(originalUrl);
  };

  // Format employment duration
  const formatEmploymentDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    
    if (diffYears > 0) {
      const remainingMonths = diffMonths % 12;
      return `${diffYears} year${diffYears > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  const displayLabel = displayMaid.type?.includes("Transfer") 
    ? "Transfer"
    : displayMaid.type?.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";


  const getLanguages = (maid) => {
    const languages = [];
    
    if (maid.maidDetails?.englishRating && maid.maidDetails.englishRating > 0) {
      languages.push({ name: 'English', rating: maid.maidDetails.englishRating });
    }
    
    if (maid.maidDetails?.chineseRating && maid.maidDetails.chineseRating > 0) {
      languages.push({ name: 'Chinese', rating: maid.maidDetails.chineseRating });
    }
    
    if (maid.maidDetails?.dialectRating && maid.maidDetails.dialectRating > 0) {
      languages.push({ name: 'Dialect', rating: maid.maidDetails.dialectRating });
    }
    
    return languages;
  };

  const maidAge = calculateAge(displayMaid.DOB);
  const languages = getLanguages(displayMaid);

  // Generate profile link for WhatsApp sharing
  const generateProfileLink = (maidId) => {
    // Use appropriate base URL based on environment
    const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://yikiat.com';
    return `${baseUrl}/maid/${maidId}`;
  };

  const handleWhatsAppContact = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }

    // Generate WhatsApp message with profile link
    const profileLink = generateProfileLink(displayMaid.id);
    const message = `Hi! I'm interested in the following domestic helper:\n\n${displayMaid.name} (ID: ${displayMaid.id})\nView Profile: ${profileLink}\n\nCould you provide more information about their availability and arrange an interview? Thank you!`;

    window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white"
        data-popup-id={displayMaid.id}
      >
        {/* Header */}
        <DialogHeader className="relative border-b border-gray-200 p-6 pb-4">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="flex items-center gap-3 pr-12">
            <img 
              src={getCountryFlag(displayMaid.country)} 
              alt={`${displayMaid.country} flag`}
              className="w-6 h-4 rounded-sm border border-gray-200"
            />
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {displayMaid.name}
              </DialogTitle>
              <p className="text-sm text-gray-600 font-medium mt-1">
                From {displayMaid.country} {maidAge && `• ${maidAge} years old`}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Profile Image Section */}
          <div className="relative flex justify-center">
            {!imageLoaded && !imageError && (
              <div className="w-full max-w-sm h-80 bg-gray-200 rounded-xl animate-pulse" />
            )}
              
            {imageError && (
              <div className="w-full max-w-sm h-80 flex flex-col items-center justify-center bg-gray-100 text-gray-500 rounded-xl">
                <User className="w-16 h-16 text-gray-400 mb-2" />
                <span className="text-sm">No image available</span>
              </div>
            )}
              
            <img
              src={getOptimizedImageUrl(displayMaid.imageUrl)}
              alt={displayMaid.name}
              loading="lazy"
              className={cn(
                "w-full max-w-sm h-80 rounded-xl object-cover transition-all duration-300",
                !isAuthenticated && "blur-lg scale-110",
                !imageLoaded && "opacity-0",
                imageError && "absolute -top-[9999px]"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
              
            {/* Status Badge */}
            <Badge 
              className="absolute top-3 left-3 bg-green-500 text-white font-bold text-xs shadow-lg"
            >
              {displayLabel}
            </Badge>

            {/* Lock Icon Overlay for Unauthenticated Users */}
            {!isAuthenticated && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center backdrop-blur-lg border-2 border-gray-600">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-900 font-semibold text-xs text-center bg-white/90 px-2 py-1 rounded">
                  Sign in to view
                </span>
              </div>
            )}
          </div>

          {/* Salary Card */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">
                    Monthly Salary
                  </p>
                  <p className="text-3xl font-bold text-orange-500">
                    ${displayMaid.salary}
                  </p>
                </div>
                {displayMaid.loan != null && (
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-600 font-semibold mb-1">
                      Loan Amount
                    </p>
                    <p className="text-xl font-bold text-amber-500">
                      ${displayMaid.loan}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {(displayMaid.skills || []).map((skill, idx) => {
                const skillEmoji = SKILL_ICONS[skill];
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-orange-100 text-orange-600 rounded-lg px-3 py-2 text-sm font-semibold border border-orange-200 hover:bg-orange-200 transition-colors cursor-default"
                    title={skill}
                  >
                    {skillEmoji && (
                      <EmojiIcon size="1.1rem">
                        {skillEmoji}
                      </EmojiIcon>
                    )}
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages - Only show if available */}
          {languages.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Language Proficiency
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <span className="font-semibold text-gray-900">
                      {language.name}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < language.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Ruler className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Height</p>
                  <p className="text-lg font-bold text-gray-900">{displayMaid.height}cm</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Weight className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Weight</p>
                  <p className="text-lg font-bold text-gray-900">{displayMaid.weight}kg</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <User className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Marital Status</p>
                  <p className="text-lg font-bold text-gray-900">{displayMaid.maritalStatus}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Users className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Children</p>
                  <p className="text-lg font-bold text-gray-900">{displayMaid.NumChildren}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <Church className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Religion</p>
                  <p className="text-lg font-bold text-gray-900">{displayMaid.Religion}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <GraduationCap className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Education</p>
                  <p className="text-lg font-bold text-gray-900">{displayMaid.maidDetails?.highestEducation || 'Not specified'}</p>
                </div>
              </div>

              {displayMaid.supplier && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <Building className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Supplier</p>
                    <p className="text-lg font-bold text-gray-900">{displayMaid.supplier}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {displayMaid.maidDetails?.description && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About {displayMaid.name}
              </h3>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {displayMaid.maidDetails.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Employment History */}
          {displayMaid.employmentDetails && displayMaid.employmentDetails.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Employment History
              </h3>
              
              <div className="space-y-4">
                {displayMaid.employmentDetails.map((employment, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 capitalize">
                            {employment.country}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatEmploymentDuration(employment.startDate, employment.endDate)}
                          </p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-600 font-semibold">
                          Family of {employment.noOfFamilyMember}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-semibold">Main Responsibilities:</span> {employment.mainJobScope}
                        </p>
                        
                        <p className="text-gray-600">
                          <span className="font-semibold">Employer:</span> {employment.employerDescription}
                        </p>
                        
                        <p className="text-amber-600 italic">
                          <span className="font-semibold">Reason for leaving:</span> {employment.reasonOfLeaving}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Work Preferences & Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Work Preferences & Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Rest Days per Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {displayMaid.maidDetails?.restDay || 'N/A'} days
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Availability Status</p>
                <Badge className={cn(
                  "text-white font-bold text-sm px-3 py-1",
                  displayMaid.isEmployed ? "bg-amber-500" : "bg-green-500"
                )}>
                  {displayMaid.isEmployed ? 'Currently Employed' : 'Available Now'}
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Experience Level</p>
                <Badge className="bg-green-500 text-white font-bold text-sm px-3 py-1">
                  {displayLabel}
                </Badge>
              </div>
              
              {displayMaid.maidDetails?.workPreferences && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium mb-2">Work Preferences</p>
                  <p className="text-lg font-bold text-gray-900">
                    {displayMaid.maidDetails.workPreferences}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <DialogFooter className="border-t border-gray-200 p-6">
          <Button
            onClick={handleWhatsAppContact}
            className={cn(
              "w-full sm:w-auto font-bold transition-all duration-200 hover:scale-105",
              isAuthenticated 
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl" 
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
            )}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isAuthenticated ? 'Contact via WhatsApp' : 'Sign in to Contact'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}