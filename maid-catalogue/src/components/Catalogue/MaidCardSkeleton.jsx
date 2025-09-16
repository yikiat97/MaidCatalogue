import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Brand colors
const brandColors = {
  primary: '#ff914d',
  secondary: '#0c191b',
  primaryLight: '#ffa366',
  primaryDark: '#e67e22',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#0c191b',
  textSecondary: '#5a6c6f',
  border: '#e0e0e0',
  success: '#25D366',
};

/**
 * Performance-optimized skeleton component matching MaidCardVariation1 exactly
 * Features: GPU-accelerated shimmer, horizontal layout, exact dimensions
 */
export default function MaidCardSkeleton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        width: '100%',
        height: isMobile ? 220 : 200,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(12, 25, 27, 0.12)',
        position: 'relative',
        background: brandColors.surface,
        border: `1px solid ${brandColors.border}`,
        display: 'flex',
        flexDirection: 'row',
        // Performance optimizations
        contain: 'layout',
        willChange: 'opacity',
        // Shimmer keyframes animation
        '@keyframes shimmer': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        },
        '& .shimmer-element': {
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.200',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            transform: 'translateX(-100%)',
            animation: 'shimmer 1.5s infinite ease-in-out',
            willChange: 'transform'
          }
        }
      }}
    >
      {/* Image Section - Left side */}
      <Box sx={{
        position: 'relative',
        width: isMobile ? '120px' : '140px',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        {/* Image skeleton with shimmer */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="shimmer-element"
          sx={{
            bgcolor: 'grey.200',
          }}
        />

        {/* Status badge skeleton */}
        <Box sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 2,
        }}>
          <Skeleton
            variant="rounded"
            width={60}
            height={20}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.300',
              borderRadius: '12px'
            }}
          />
        </Box>

        {/* Lock icon placeholder (centered) */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            className="shimmer-element"
            sx={{ bgcolor: 'grey.300' }}
          />
        </Box>
      </Box>

      {/* Content Section - Right side */}
      <CardContent sx={{
        p: 2,
        pb: '8px !important',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: 0
      }}>
        {/* Top Content */}
        <Box>
          {/* Name + Flag + Heart row */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5
          }}>
            {/* Name skeleton */}
            <Skeleton
              variant="text"
              width="60%"
              height={isMobile ? 24 : 26}
              className="shimmer-element"
              sx={{
                bgcolor: 'grey.300',
                flex: 1
              }}
            />
            {/* Flag skeleton */}
            <Skeleton
              variant="rectangular"
              width={20}
              height={15}
              className="shimmer-element"
              sx={{ bgcolor: 'grey.300', borderRadius: '2px' }}
            />
            {/* Heart skeleton */}
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              className="shimmer-element"
              sx={{ bgcolor: 'grey.300' }}
            />
          </Box>

          {/* Country skeleton */}
          <Box sx={{ mb: 0.5 }}>
            <Skeleton
              variant="text"
              width="45%"
              height={16}
              className="shimmer-element"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>

          {/* Physical Stats Row - Age, Height, Weight */}
          <Box sx={{
            display: 'flex',
            gap: isMobile ? 0.5 : 0.75,
            mb: 0.5,
            alignItems: 'center',
            flexWrap: 'nowrap'
          }}>
            {/* Age */}
            <Skeleton
              variant="text"
              width={isMobile ? 25 : 30}
              height={16}
              className="shimmer-element"
              sx={{ bgcolor: 'grey.200' }}
            />
            {/* Separator */}
            <Box sx={{
              width: '1.5px',
              height: '16px',
              backgroundColor: 'grey.300',
              borderRadius: '1px'
            }} />
            {/* Height */}
            <Skeleton
              variant="text"
              width={isMobile ? 35 : 40}
              height={16}
              className="shimmer-element"
              sx={{ bgcolor: 'grey.200' }}
            />
            {/* Separator */}
            <Box sx={{
              width: '1.5px',
              height: '16px',
              backgroundColor: 'grey.300',
              borderRadius: '1px'
            }} />
            {/* Weight */}
            <Skeleton
              variant="text"
              width={isMobile ? 35 : 40}
              height={16}
              className="shimmer-element"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>

          {/* Skills Row */}
          <Box sx={{
            display: 'flex',
            gap: 0.3,
            flexWrap: 'nowrap',
            overflow: 'hidden',
            mb: 0.5
          }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rounded"
                width={26}
                height={26}
                className="shimmer-element"
                sx={{
                  bgcolor: 'grey.200',
                  borderRadius: '4px',
                  flexShrink: 0
                }}
              />
            ))}
            {/* "+X" indicator */}
            <Skeleton
              variant="text"
              width={20}
              height={16}
              className="shimmer-element"
              sx={{
                bgcolor: 'grey.200',
                alignSelf: 'center',
                ml: 0.5
              }}
            />
          </Box>

          {/* Salary skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <Skeleton
              variant="text"
              width="50%"
              height={24}
              className="shimmer-element"
              sx={{
                bgcolor: '#25D36620',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)'
                }
              }}
            />
          </Box>
        </Box>

        {/* Bottom Actions - Buttons row */}
        <Box sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center'
        }}>
          {/* Select button skeleton */}
          <Skeleton
            variant="rounded"
            width={60}
            height={32}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.200',
              borderRadius: '8px'
            }}
          />

          {/* Details button skeleton */}
          <Skeleton
            variant="rounded"
            width={60}
            height={32}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.300',
              borderRadius: '8px'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}